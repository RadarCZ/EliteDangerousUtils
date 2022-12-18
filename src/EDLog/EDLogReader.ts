import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { RawLog } from './EDEvent';

export class EDLogReader {
  public static readonly fileMatcher = /^Journal\.\d{4}-\d{2}-\d{2}T\d{6}\.\d{2}\.log$/;
  private files?: string[];

  public fetchFiles(directory: string) {
    const files = readdirSync(directory).filter(file => EDLogReader.fileMatcher.test(file));
    files.sort((a, b) => {
      const dateMatcher = /\d{4}-\d{2}-\d{2}T\d{6}/
      const aDate = new Date(a.match(dateMatcher)![0]);
      const bDate = new Date(b.match(dateMatcher)![0]);
      return aDate.valueOf() - bDate.valueOf();
    })
    this.files = files;
    return files
  }

  public read(directory: string, useCachedFiles = true): RawLog[] {
    const out: RawLog[] = [];
    (useCachedFiles && this.files ? this.files : this.fetchFiles(directory)).forEach(fileName => {
      readFileSync(join(directory, fileName), 'utf8')
        .split('\n')
        .forEach(line => {
          if (line === '') {
            return;
          }
          out.push(JSON.parse(line));
        });
    });
    return out;
  }
}
