import gspread
import sys, os
import getpass, json
KEY = '0AuP1oLBXUWp1dE00cVItdlZqeTVRVDFSMmh3U2ZVTGc'
SHEET = ''
DATA_PATH = '../scraper/out/'



def dosync(args):
    gc = gspread.login('kotecha.ravi@gmail.com', getpass.getpass())
    ss = gc.open_by_key(KEY)
    wb = ss.get_worksheet(2)
    all_data = []
    for f in os.listdir(DATA_PATH):
        with open(DATA_PATH + f, 'r') as jsonfile:
            data = json.load(jsonfile)
            for i in data:
                all_data.append(i)
    wb.resize(0, 10)

    wb.append_row(all_data[0].keys())
    for item in all_data:
        print ','
        wb.append_row(item.values())
    print len(all_data)


if __name__ == '__main__':
    dosync(sys.argv)
