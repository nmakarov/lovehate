## Prepare word lists

	awk 'length == 4 {print $0}' /usr/share/dict/words > 4.txt

	awk 'length == 3 {print $0}' /usr/share/dict/words > 3.txt

	iconv -f WINDOWS-1251 it UTF-8 zdf-win.txt >93391_rus_zalizniak.txt


