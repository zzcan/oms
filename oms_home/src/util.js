import { parse,stringify } from 'qs';
export function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}