import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


interface Asignatura {
  codigo: string;
  nombre: string;
  seccion: string;
  sala: string;
  fecha: string;
  asistencia: boolean;
  lastAttendanceDate?: string;  // Fecha de última asistencia
  lastScanDate?: string;        // Fecha del último escaneo de QR
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  username: string = 'Usuario'; 
  batteryLevel: number = 0;
  weatherInfo: any = {};
  qrData: any;
  showSearchBar: boolean = false; 
  searchQuery: string = ''; 
  scanActive: boolean = false;
  attendanceCount: number = 0;
  totalAttendance: number = 20;

  asignaturas: Asignatura[] = [
    { codigo: 'PGY5722', nombre: 'Aplicaciones Móviles', seccion: '014D', sala: 'L4', fecha: '20241103', asistencia: false },
    { codigo: 'PGY4221', nombre: 'Arquitectura', seccion: '', sala: '', fecha: '', asistencia: false },
    { codigo: 'PGY4321', nombre: 'Calidad de Software', seccion: '', sala: '', fecha: '', asistencia: false },
    { codigo: 'PGY4421', nombre: 'Inglés', seccion: '', sala: '', fecha: '', asistencia: false }
  ];

  constructor(
    private toastController: ToastController, 
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username']; 
      }
      this.mostrarBienvenida();
    });
    this.getBatteryInfo();
    this.getWeatherInfo();
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  async mostrarBienvenida() {
    const toast = await this.toastController.create({
      message: `¡Bienvenido, ${this.username}!`,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async getBatteryInfo() {
    try {
      const info = await Device.getBatteryInfo();
      this.batteryLevel = info.batteryLevel ? Math.round(info.batteryLevel * 100) : 0;
    } catch (error) {
      console.error('Error al obtener información de la batería:', error);
    }
  }

  async startScan(subject: string) {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const asignatura = this.asignaturas.find(asig => asig.nombre === subject);

    // Verificar si la asignatura fue encontrada
    if (!asignatura) {
      const toast = await this.toastController.create({
        message: 'Asignatura no encontrada.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return; // Termina la ejecución si no se encuentra la asignatura
    }

    // Verificar si ya se escaneó el QR hoy
    if (asignatura.lastScanDate === today) {
      const toast = await this.toastController.create({
        message: `El código QR de ${asignatura.nombre} ya ha sido escaneado hoy.`,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return; // No permite otro escaneo si ya se hizo hoy
    }

    this.scanActive = true;
    try {
      const permission = await BarcodeScanner.checkPermission({ force: true });
      if (!permission.granted) {
        this.showAlert('Error', 'Permiso de cámara denegado');
        return;
      }

      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.qrData = result.content;
        this.processQRCode(this.qrData, asignatura);
        asignatura.lastScanDate = today;  // Actualiza la fecha de escaneo
      } else {
        this.showAlert('Escaneo fallido', 'No se encontró contenido en el código QR.');
      }
    } catch (error) {
      console.error('Error durante el escaneo del código QR:', error);
      this.showAlert('Error', 'Ocurrió un error durante el escaneo');
    } finally {
      document.querySelector('body')?.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    }
  }

  showAlert(arg0: string, arg1: string) {
    throw new Error('Method not implemented.');
  }

  async processQRCode(qrData: string, asignatura: Asignatura) {
    const [codigo, seccion, sala, fecha] = qrData.split('|');
    if (asignatura) {
      asignatura.seccion = seccion;
      asignatura.sala = sala;
      asignatura.fecha = fecha;
      asignatura.asistencia = true;
      this.attendanceCount++;

      // Mostrar mensaje de asistencia
      const toast = await this.toastController.create({
        message: `Asistencia registrada para ${asignatura.nombre}`,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Código de asignatura no válido',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  async openClassesModal() {
    const alert = await this.toastController.create({
      header: 'Registrar Asistencia',
      message: 'Selecciona una asignatura para registrar la asistencia.',
      buttons: this.asignaturas.map(asignatura => ({
        text: asignatura.nombre,
        handler: () => this.startScan(asignatura.nombre)
      }))
    });

    await alert.present();
  }

  async getWeatherInfo() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lon = coordinates.coords.longitude;

      const apiKey = 'TU_API_KEY';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      this.http.get(url).subscribe(
        (data: any) => {
          this.weatherInfo = {
            temperature: data.main.temp,
            description: data.weather[0].description
          };
        },
        error => {
          console.error('Error al obtener información del clima:', error);
        }
      );
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  async stopScan() {
    this.scanActive = false;
    await BarcodeScanner.stopScan();
  }
}

