"""Download the official fonts and generate WOFF subsets for the current site.
Requires fonttools. Run from the repository root with Python 3.
"""
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.request import urlopen
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'dist' / 'assets'
FONTS = [
    ('shippori-regular', 'shipporimincho', 'ShipporiMincho-Regular.ttf'),
    ('shippori-medium', 'shipporimincho', 'ShipporiMincho-Medium.ttf'),
    ('zen-kaku-regular', 'zenkakugothicnew', 'ZenKakuGothicNew-Regular.ttf'),
]

class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
    def handle_data(self, text):
        self.text.append(text)
    def handle_starttag(self, tag, attrs):
        self.text.extend(value for key, value in attrs if value and key in ('aria-label', 'alt', 'title'))


def main():
    parser = VisibleText()
    for page in (ROOT / 'dist').rglob('*.html'):
        parser.feed(page.read_text())
    characters = ''.join(parser.text)
    with TemporaryDirectory(prefix='holic-fonts-') as temp:
        for name, family, filename in FONTS:
            url = f'https://raw.githubusercontent.com/google/fonts/main/ofl/{family}/{filename}'
            source = Path(temp) / filename
            source.write_bytes(urlopen(url, timeout=30).read())
            options = subset.Options()
            options.flavor = 'woff'
            options.hinting = False
            font = subset.load_font(source, options)
            subsetter = subset.Subsetter(options=options)
            subsetter.populate(text=characters)
            subsetter.subset(font)
            output = ASSETS / f'{name}.woff'
            subset.save_font(font, output, options)
            print(f'{output.name}: {output.stat().st_size:,} bytes')
    for family, label in [('shipporimincho', 'ShipporiMincho'), ('zenkakugothicnew', 'ZenKakuGothicNew')]:
        url = f'https://raw.githubusercontent.com/google/fonts/main/ofl/{family}/OFL.txt'
        license_text = urlopen(url, timeout=30).read().decode()
        (ASSETS / f'OFL-{label}.txt').write_text(''.join(line.rstrip() + '\n' for line in license_text.splitlines()))

if __name__ == '__main__':
    main()
