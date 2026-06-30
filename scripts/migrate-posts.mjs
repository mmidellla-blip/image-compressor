// 기존 TypeScript 블로그 데이터를 posts/*.json으로 변환하는 마이그레이션 스크립트
import { createRequire } from 'module';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// tsx로 TypeScript 파일을 직접 import할 수 없으므로
// next build에서 만들어진 데이터를 활용하거나
// 직접 파일에서 파싱합니다.
// 대신 API 라우트를 통해 처리합니다.

console.log('scripts/migrate-posts.mjs: 이 스크립트는 API 라우트를 통해 실행됩니다.');
console.log('http://localhost:3000/api/admin/migrate 를 호출하세요.');
