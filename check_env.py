
with open(r'c:\Kadyr\work_place\Japbar\.env', 'rb') as f:
    content = f.read()
    print(content)
    for i, b in enumerate(content):
        if b > 127:
            print(f"Non-ASCII byte {hex(b)} at position {i}")