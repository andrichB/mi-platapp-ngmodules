/*
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false, 
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/
import { Component, ViewChild } from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  standalone:false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  // Referencias a los modales
  
  @ViewChild('incomeModal') incomeModal!: IonModal;
  @ViewChild('expenseModal') expenseModal!: IonModal;
  @ViewChild('transferModal') transferModal!: IonModal;
  
  // Datos para los formularios
  incomeData = {
    amount: null as number | null,
    description: ''
  };

  expenseData = {
    amount: null as number | null,
    category: 'food'
  };

  transferData = {
    amount: null as number | null,
    fromAccount: 'checking',
    toAccount: 'savings'
  };

  // Mensajes y estado
  message = '';
  isLoading = false;

  constructor(private loadingController: LoadingController) {}

  // Manejar cierre del modal
  async onWillDismiss(event: Event, type: string) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    
    if (ev.detail.role === 'confirm') {
      await this.processTransaction(type);
    } else {
      this.message = `${this.getTransactionTypeName(type)} cancelada`;
      this.resetFormData(type);
    }
  }

  // Procesar la transacción
  private async processTransaction(type: string) {
    const loading = await this.loadingController.create({
      message: 'Procesando...',
      duration: 2000
    });
    
    await loading.present();

    try {
      // Simulamos un tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí iría tu lógica real para guardar los datos
      switch(type) {
        case 'income':
          console.log('Ingreso guardado:', this.incomeData);
          break;
        case 'expense':
          console.log('Egreso guardado:', this.expenseData);
          break;
        case 'transfer':
          console.log('Transferencia guardada:', this.transferData);
          break;
      }

      this.message = `${this.getTransactionTypeName(type)} guardada correctamente`;
      this.resetFormData(type);
    } catch (error) {
      this.message = `Error al guardar ${this.getTransactionTypeName(type)}`;
      console.error(error);
    } finally {
      await loading.dismiss();
    }
  }

  // Obtener nombre legible del tipo
  private getTransactionTypeName(type: string): string {
    switch(type) {
      case 'income': return 'Ingreso';
      case 'expense': return 'Egreso';
      case 'transfer': return 'Transferencia';
      default: return 'Transacción';
    }
  }

  // Resetear datos del formulario
  private resetFormData(type: string) {
    switch(type) {
      case 'income':
        this.incomeData = { amount: null, description: '' };
        break;
      case 'expense':
        this.expenseData = { amount: null, category: 'food' };
        break;
      case 'transfer':
        this.transferData = { amount: null, fromAccount: 'checking', toAccount: 'savings' };
        break;
    }
  }

  // Cancelar acción
  cancel(modalType: string) {
    this.message = `${this.getTransactionTypeName(modalType)} cancelada`;
    this.resetFormData(modalType);
    
    // Cierra el modal específico
    switch(modalType) {
      case 'income':
        this.incomeModal.dismiss(null, 'cancel');
        break;
      case 'expense':
        this.expenseModal.dismiss(null, 'cancel');
        break;
      case 'transfer':
        this.transferModal.dismiss(null, 'cancel');
        break;
    }
  }

  // Confirmar acción (manejado por onWillDismiss)
  confirm(type: string) {
    // La lógica de confirmación ahora está en onWillDismiss
    // Este método se mantiene para la plantilla HTML
  }

  // Validar formulario
  isFormValid(type: string): boolean {
    switch(type) {
      case 'income':
        return !!this.incomeData.amount && this.incomeData.amount > 0 && 
               this.incomeData.description.trim().length > 0;
      case 'expense':
        return !!this.expenseData.amount && this.expenseData.amount > 0;
      case 'transfer':
        return !!this.transferData.amount && this.transferData.amount > 0 &&
               this.transferData.fromAccount !== this.transferData.toAccount;
      default:
        return false;
    }
  }
}