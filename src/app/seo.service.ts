import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }

  updateKeywords(keywords: string[]) {
    this.meta.updateTag({ name: 'keywords', content: keywords.join(', ') });
  }

  updateOgTags(title: string, description: string, image: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({
        property: 'og:url',
        content: window.location.href,
      });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
    }
  }
}
