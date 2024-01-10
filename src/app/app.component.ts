import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

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

  selectedImageIndex: number = 1;
  quantity: number = 0;
  color: string = 'white';
  display: boolean = false;
  lanterns = [
    {
      id: 1,
      image: '1.png',
    },
    {
      id: 2,
      image: '2.png',
    },
    {
      id: 3,
      image: '3.png',
    },
    {
      id: 4,
      image: '4.png',
    },
    {
      id: 5,
      image: '5.png',
    },
  ];
  shippingForm = this.FormBuilder.group({
    name: '',
    address: '',
    phone: null,
    message: '',
  });
  constructor(
    private readonly FormBuilder: FormBuilder,
    private readonly http: HttpClient,
    private messageService: MessageService
  ) {}
  showDialog() {
    this.display = true;
  }

  confirm() {
    const url = 'https://formspree.io/f/xwkgpknn';
    const data = {
      name: this.shippingForm.value.name,
      address: this.shippingForm.value.address,
      phone: this.shippingForm.value.phone,
      message: this.shippingForm.value.message,
      quantity: this.quantity,
      color: this.color,
    };
    this.http.post(url, data).subscribe(() => {
      this.display = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Order Placed Successfully ',
      });
    });
  }
}
