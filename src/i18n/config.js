import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.buyTickets": "Buy Tickets",
      "nav.superball": "Super Ball",
      "nav.results": "Results",
      "nav.history": "History",
      "nav.myAccount": "My Account",
      
      // Auth
      "auth.login": "Login",
      "auth.register": "Register",
      "auth.logout": "Logout",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.firstName": "First Name",
      "auth.lastName": "Last Name",
      
      // Lottery
      "lottery.selectCountries": "Select Countries",
      "lottery.addTicket": "Add Ticket",
      "lottery.viewTickets": "View Tickets",
      "lottery.totalAmount": "Total Amount",
      "lottery.checkout": "Checkout",
      
      // Payment
      "payment.selectMethod": "Select Payment Method",
      "payment.scanQR": "Scan QR Code",
      "payment.enterTXID": "Enter Transaction ID",
      "payment.completePayment": "Complete Payment",
      
      // Admin
      "admin.orders": "Orders",
      "admin.users": "Users",
      "admin.winners": "Winners",
      "admin.uploadNumbers": "Upload Winner Numbers",
      
      // Messages
      "msg.success": "Success",
      "msg.error": "Error",
      "msg.loading": "Loading...",
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.buyTickets": "Comprar Boletos",
      "nav.superball": "Super Ball",
      "nav.results": "Resultados",
      "nav.history": "Historial",
      "nav.myAccount": "Mi Cuenta",
      
      // Auth
      "auth.login": "Iniciar Sesión",
      "auth.register": "Registrarse",
      "auth.logout": "Cerrar Sesión",
      "auth.email": "Correo Electrónico",
      "auth.password": "Contraseña",
      "auth.firstName": "Nombre",
      "auth.lastName": "Apellido",
      
      // Lottery
      "lottery.selectCountries": "Selecciona Países",
      "lottery.addTicket": "Agregar Boleto",
      "lottery.viewTickets": "Ver Boletos",
      "lottery.totalAmount": "Monto Total",
      "lottery.checkout": "Finalizar Compra",
      
      // Payment
      "payment.selectMethod": "Selecciona Tu Método de Pago",
      "payment.scanQR": "Escanea el Código QR",
      "payment.enterTXID": "Ingresa el ID de Transacción",
      "payment.completePayment": "Completar Pago",
      
      // Admin
      "admin.orders": "Órdenes",
      "admin.users": "Usuarios",
      "admin.winners": "Ganadores",
      "admin.uploadNumbers": "Subir Números Ganadores",
      
      // Messages
      "msg.success": "Éxito",
      "msg.error": "Error",
      "msg.loading": "Cargando...",
    }
  },
  fr: {
    translation: {
      // Navigation
      "nav.buyTickets": "Acheter des Billets",
      "nav.superball": "Super Ball",
      "nav.results": "Résultats",
      "nav.history": "Historique",
      "nav.myAccount": "Mon Compte",
      
      // Auth
      "auth.login": "Se Connecter",
      "auth.register": "S'inscrire",
      "auth.logout": "Se Déconnecter",
      "auth.email": "Email",
      "auth.password": "Mot de Passe",
      "auth.firstName": "Prénom",
      "auth.lastName": "Nom",
      
      // Lottery
      "lottery.selectCountries": "Sélectionner les Pays",
      "lottery.addTicket": "Ajouter un Billet",
      "lottery.viewTickets": "Voir les Billets",
      "lottery.totalAmount": "Montant Total",
      "lottery.checkout": "Passer à la Caisse",
      
      // Payment
      "payment.selectMethod": "Sélectionner le Mode de Paiement",
      "payment.scanQR": "Scanner le Code QR",
      "payment.enterTXID": "Entrer l'ID de Transaction",
      "payment.completePayment": "Terminer le Paiement",
      
      // Admin
      "admin.orders": "Commandes",
      "admin.users": "Utilisateurs",
      "admin.winners": "Gagnants",
      "admin.uploadNumbers": "Télécharger les Numéros Gagnants",
      
      // Messages
      "msg.success": "Succès",
      "msg.error": "Erreur",
      "msg.loading": "Chargement...",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    }
  });

export default i18n;
