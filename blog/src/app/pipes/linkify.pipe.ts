import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'linkify',
    standalone: true
})
export class LinkifyPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(text: string): SafeHtml {
        if (!text) return '';

        const urlPattern = /(\b(https?:\/\/|www\.)[^\s<]+[^<.,:;"')\]\s])/gi;

        const linkedText = text.replace(urlPattern, (url) => {
            let href = url;

            if (url.startsWith('www.')) {
                href = 'https://' + url;
            }

            let displayUrl = url;
            if (url.length > 50) {
                displayUrl = url.substring(0, 47) + '...';
            }

            return `<a href="${href}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="comment-link">
                ${displayUrl}
              </a>`;
        });

        return this.sanitizer.bypassSecurityTrustHtml(linkedText);
    }
}