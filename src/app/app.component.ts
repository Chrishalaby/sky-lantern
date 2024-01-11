import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
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
  providers: [FormBuilder, HttpClient, MessageService],
})
export class AppComponent {
  title = 'sky-lantern';
  selectedImageIndex = 1;
  quantity = 1;
  color: LanternColor = LanternColor.White;
  lanternColors = Object.values(LanternColor);
  display = false;
  lanterns: Lantern[] = [
    { id: 1, image: '1.png' },
    { id: 2, image: '2.png' },
    { id: 3, image: '3.png' },
    { id: 4, image: '4.png' },
    { id: 5, image: '5.png' },
  ];
  shippingForm = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: [null, Validators.required],
    message: '',
  });
  addedToCart: Cart = { white: 0, pink: 0, orange: 0 };
  showCartDialog = false;

  socialMediaLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/yourpage',
      icon: 'pi-facebook',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/yourpage',
      icon: 'pi-instagram',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@yourpage',
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

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

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
}
