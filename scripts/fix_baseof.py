#!/usr/bin/env python3
"""Fix baseof.html for Hugo v0.141.0 compatibility"""
import re, sys

f = sys.argv[1] if len(sys.argv) > 1 else 'themes/blowfish/layouts/_default/baseof.html'
c = open(f, encoding='utf-8').read()
# Replace the entire lang attribute line
new_line = '  lang="{{ site.Params.isoCode | default `zh-CN` }}"'
c = re.sub(r'^  lang=.*$', new_line, c, flags=re.MULTILINE)
open(f, 'w', encoding='utf-8').write(c)
print('Patched: ' + f)
