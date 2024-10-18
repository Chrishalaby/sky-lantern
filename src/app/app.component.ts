import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, map, startWith } from 'rxjs';
import { SeoService } from './seo.service';

interface Lantern {
  id: number;
  image: string;
}

enum LanternColor {
  White = 'white',
  Pink = 'pink',
  Orange = 'orange',
}

interface Cart {
  white: number;
  pink: number;
  orange: number;
}

interface Review {
  stars: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    InputNumberModule,
    ButtonModule,
    TabViewModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    InputTextModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private seoService = inject(SeoService);

  title = 'Sky Lantern Store';
  selectedImageIndex = 1;
  quantity = 1;
  color: LanternColor = LanternColor.White;
  lanternColors = Object.values(LanternColor);
  display = false;
  lanterns: Lantern[] = [
    { id: 1, image: '1.webp' },
    { id: 2, image: '2.webp' },
    { id: 3, image: '3.webp' },
    { id: 4, image: '4.webp' },
    { id: 5, image: '5.webp' },
  ];

  reviews: Review[] = [
    {
      stars: 5,
      title: 'Magical Experience!',
      content: 'Absolutely loved them!',
      author: 'Chady El Khoury',
      date: '1 day ago',
    },
    {
      stars: 4,
      title: 'Beautiful and Easy to Use',
      content: 'Really beautiful lanterns and easy to set up.',
      author: 'Ahmad Farhat',
      date: '3 days ago',
    },
    {
      stars: 5,
      title: 'Amazing!',
      content:
        'The lanterns were the highlight of my birthday party. Thank you amazing!',
      author: 'George Maalouf',
      date: '5 days ago',
    },
  ];

  shippingForm = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: [null, [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    message: '',
    coupon: '',
  });
  addedToCart: Cart = { white: 0, pink: 0, orange: 0 };
  showCartDialog = false;

  socialMediaLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/lanternlb',
      icon: 'pi-instagram',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@lanternlb',
      icon: 'pi-hashtag',
    },
  ];

  private cartState = new BehaviorSubject<Cart>(this.addedToCart);
  cartItems$ = this.cartState.pipe(
    map((cart) =>
      Object.entries(cart).map(([color, quantity]) => ({
        color: color as LanternColor,
        quantity,
      }))
    )
  );
  isCartEmpty$ = this.cartState.pipe(
    map((cart) => Object.values(cart).every((quantity) => quantity === 0)),
    startWith(true)
  );

  ngOnInit() {
    this.updateSeoTags();
  }

  private updateSeoTags() {
    this.seoService.updateTitle(this.title);
    this.seoService.updateDescription(
      'Beautiful sky lanterns for all your celebrations. Eco-friendly and easy to use.'
    );
    this.seoService.updateKeywords([
      'sky lanterns',
      'eco-friendly',
      'celebrations',
      'weddings',
      'parties',
    ]);
    this.seoService.updateOgTags(
      this.title,
      'Beautiful sky lanterns for all your celebrations. Eco-friendly and easy to use.',
      'https://lanternlb.netlify.app/assets/images/1.webp'
    );
  }

  showDialog(): void {
    this.showCartDialog = false;
    this.display = true;
  }

  confirm(): void {
    const url = 'https://formspree.io/f/xwkgpknn';

    const orderData = {
      ...this.shippingForm.value,
      cartItems: this.addedToCart,
    };

    this.http.post(url, orderData).subscribe(() => {
      this.display = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Order Placed Successfully',
      });
      this.resetCart();
    });
  }

  addToCart(): void {
    this.addedToCart[this.color as keyof Cart] += this.quantity;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${this.quantity} ${this.color} Lantern Added To Cart`,
    });
    this.cartState.next(this.addedToCart);
    this.updateCart();
  }

  showCart(): void {
    this.showCartDialog = true;
  }

  removeProduct(productColor: LanternColor): void {
    this.addedToCart[productColor as keyof Cart] = 0;
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: `${productColor} Lantern Removed From Cart`,
    });
    this.cartState.next(this.addedToCart);
    this.updateCart();
  }

  getColorClass(color: LanternColor): string {
    switch (color) {
      case LanternColor.White:
        return 'bg-white';
      case LanternColor.Pink:
        return 'bg-pink-500';
      case LanternColor.Orange:
        return 'bg-orange-400';
      default:
        return '';
    }
  }

  cartHasItems(): boolean {
    return Object.values(this.addedToCart).some((quantity) => quantity > 0);
  }

  private updateCart(): void {
    this.cartState.next(this.addedToCart);
  }

  private resetCart(): void {
    this.addedToCart = { white: 0, pink: 0, orange: 0 };
    this.cartState.next(this.addedToCart);
  }

  getStarsArray(stars: number) {
    return Array(5)
      .fill(false)
      .map((_, index) => index < stars);
  }
}
