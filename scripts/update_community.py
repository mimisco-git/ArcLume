#!/usr/bin/env python3
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / 'data' / 'community.json'
TIMEOUT = 30
HEADERS = {
    'User-Agent': 'ArcLume-Community-Updater/1.0 (+https://github.com/mimisco-git/Arc-Hub)'
}

SPECS = [
    {
        'id': 'home-office-hours-1',
        'url': 'https://community.arc.network/',
        'fallback': {
            'title': 'Arc Discord Office Hours',
            'type': 'event',
            'priority': 'high',
            'source': 'Arc House Home',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-04-07T17:00:00Z',
            'icon': '◎',
            'summary': 'Recurring Arc House office hours listed on the public home page.',
            'actionLabel': 'Open Arc House',
        },
    },
    {
        'id': 'vibecard-event',
        'url': 'https://community.arc.network/public/events',
        'fallback': {
            'title': 'Building Agentic Commerce on Arc: VibeCard',
            'type': 'event',
            'priority': 'high',
            'source': 'Arc House Events',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-04-15T17:00:00Z',
            'icon': '✦',
            'summary': 'Builder spotlight for agentic commerce on Arc.',
            'actionLabel': 'Open event slate',
        },
    },
    {
        'id': 'agentic-hackathon',
        'url': 'https://community.arc.network/home/events/agentic-economy-on-arc-hackathon-xoayqenc6j',
        'fallback': {
            'title': 'Agentic Economy on Arc Hackathon',
            'type': 'event',
            'priority': 'high',
            'source': 'Arc House Event Page',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-04-20T07:00:00Z',
            'icon': '⬡',
            'summary': 'Hybrid hackathon for agentic economic apps on Arc.',
            'actionLabel': 'Open event page',
        },
    },
    {
        'id': 'tiers-benefits',
        'url': 'https://community.arc.network/home/resources/architects-tiers-and-benefits',
        'fallback': {
            'title': 'Architects: Tiers & Benefits',
            'type': 'tier',
            'priority': 'high',
            'source': 'Architect Docs',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-03-31T00:00:00Z',
            'icon': '◎',
            'summary': 'Tier 0 starts at registration and Tier 1 starts at 500 points after opt-in.',
            'actionLabel': 'Open tiers guide',
        },
    },
    {
        'id': 'program-overview',
        'url': 'https://community.arc.network/home/resources/architects-overview',
        'fallback': {
            'title': 'Architects: Program Overview',
            'type': 'tier',
            'priority': 'medium',
            'source': 'Architect Docs',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-03-31T00:00:00Z',
            'icon': '◇',
            'summary': 'Overview of the Architects program and contribution-based progression.',
            'actionLabel': 'Open overview',
        },
    },
    {
        'id': 'contribution-rules',
        'url': 'https://community.arc.network/public/contributors/contribution-rules',
        'fallback': {
            'title': 'Contribution Rules',
            'type': 'points',
            'priority': 'high',
            'source': 'Contribution Rules',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-03-31T00:00:00Z',
            'icon': '✧',
            'summary': 'Public rules for points and badges across events, onboarding, activity, and content.',
            'actionLabel': 'Open contribution rules',
        },
    },
    {
        'id': 'contributors-signin',
        'url': 'https://community.arc.network/public/contributors',
        'fallback': {
            'title': 'Contributor board and My Contributions',
            'type': 'signin',
            'priority': 'medium',
            'source': 'Contributors',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public + sign-in',
            'when': '2026-04-04T00:00:00Z',
            'icon': '↗',
            'summary': 'Leaderboard is public while personal points and badges require sign-in.',
            'actionLabel': 'Open contributors',
        },
    },
    {
        'id': 'connect-arc',
        'url': 'https://docs.arc.network/arc/references/connect-to-arc',
        'fallback': {
            'title': 'Connect to Arc',
            'type': 'build',
            'priority': 'medium',
            'source': 'Arc Docs',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-04-04T00:00:00Z',
            'icon': '⌁',
            'summary': 'Official Arc Testnet network details and wallet setup reference.',
            'actionLabel': 'Open network docs',
        },
    },
    {
        'id': 'gas-and-fees',
        'url': 'https://docs.arc.network/arc/references/gas-and-fees',
        'fallback': {
            'title': 'Gas and Fees',
            'type': 'build',
            'priority': 'low',
            'source': 'Arc Docs',
            'mode': 'Auto-updating public feed',
            'visibility': 'Public',
            'when': '2026-04-04T00:00:00Z',
            'icon': '$',
            'summary': 'USDC gas and testnet fee guidance for Arc.',
            'actionLabel': 'Open gas docs',
        },
    },
]

RESOURCE_DEFAULTS = [
    {'title': 'Arc House home', 'icon': '⌂', 'desc': 'Public home for events, content, discussions, and sign-in.', 'url': 'https://community.arc.network/'},
    {'title': 'Events', 'icon': '◴', 'desc': 'Public Arc House event slate.', 'url': 'https://community.arc.network/public/events'},
    {'title': 'Architects overview', 'icon': '◎', 'desc': 'Public overview of the Architects program.', 'url': 'https://community.arc.network/home/resources/architects-overview'},
    {'title': 'Architect tiers and benefits', 'icon': '◌', 'desc': 'Tier ladder and benefits.', 'url': 'https://community.arc.network/home/resources/architects-tiers-and-benefits'},
    {'title': 'Contribution rules', 'icon': '✦', 'desc': 'Public rules for points and badges.', 'url': 'https://community.arc.network/public/contributors/contribution-rules'},
    {'title': 'Connect to Arc', 'icon': '⌁', 'desc': 'Official Arc Testnet setup guide.', 'url': 'https://docs.arc.network/arc/references/connect-to-arc'},
]


def clean_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text or '').strip()


def fetch_page(url: str) -> str:
    resp = requests.get(url, timeout=TIMEOUT, headers=HEADERS)
    resp.raise_for_status()
    return resp.text


def extract_title_and_summary(html: str, fallback_title: str, fallback_summary: str):
    soup = BeautifulSoup(html, 'html.parser')
    title = fallback_title
    summary = fallback_summary
    h1 = soup.find('h1')
    if h1:
        title = clean_text(h1.get_text()) or fallback_title
    meta_desc = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
    if meta_desc and meta_desc.get('content'):
        summary = clean_text(meta_desc['content']) or fallback_summary
    else:
        paragraphs = [clean_text(node.get_text(' ')) for node in soup.find_all(['p', 'div'])]
        paragraphs = [p for p in paragraphs if len(p) > 80]
        if paragraphs:
            summary = paragraphs[0][:260]
    return title, summary


def load_existing() -> dict:
    if DATA_PATH.exists():
        try:
            return json.loads(DATA_PATH.read_text())
        except Exception:
            pass
    return {'items': []}


def main():
    existing = load_existing()
    existing_map = {item.get('id'): item for item in existing.get('items', []) if item.get('id')}
    items = []
    source_urls = []

    for spec in SPECS:
        item = dict(spec['fallback'])
        item['id'] = spec['id']
        item['url'] = spec['url']
        source_urls.append({'label': item.get('title', spec['id']), 'url': spec['url']})
        try:
            html = fetch_page(spec['url'])
            title, summary = extract_title_and_summary(html, item['title'], item['summary'])
            item['title'] = title
            item['summary'] = summary
        except Exception:
            if spec['id'] in existing_map:
                old = dict(existing_map[spec['id']])
                old.update({k: v for k, v in item.items() if not old.get(k)})
                item = old
        items.append(item)

    data = {
        'meta': {
            'generatedAt': datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z'),
            'sourceMode': 'Auto-updating public feed via GitHub Actions, with local JSON fallback',
            'notes': 'Public Arc House and Arc Docs data only. Private Arc House profile data still requires sign-in.',
            'sources': source_urls,
        },
        'items': items,
        'resources': RESOURCE_DEFAULTS,
    }
    DATA_PATH.write_text(json.dumps(data, indent=2) + '\n')
    print(f'Updated {DATA_PATH}')


if __name__ == '__main__':
    main()
