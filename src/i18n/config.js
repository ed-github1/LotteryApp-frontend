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
      
      // Home Page
      "home.hero.title": "Build your money future",
      "home.hero.subtitle": "Pick your lucky numbers, join global draws, and win securely — simple flows and transparent payouts.",
      "home.hero.getStarted": "Get started Now",
      "home.nextDraw.title": "Next Draw",
      "home.nextDraw.subtitle": "Don't miss your chance to win big!",
      "home.nextDraw.playNow": "Play Now",
      "home.contact.title": "Ready to Win Big?",
      "home.contact.subtitle": "Join thousands of winners worldwide. Get started today or reach out to our support team.",
      "home.contact.getInTouch": "Get in Touch",
      "home.contact.followUs": "Follow Us",
      "home.contact.followSubtitle": "Stay updated with the latest draws and winners",
      "home.contact.startPlaying": "Start Playing",
      "home.contact.startPlayingDesc": "Join millions of players worldwide and start your winning journey today.",
      "home.contact.getStarted": "Get Started",
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
      
      // Home Page
      "home.hero.title": "Construye tu futuro financiero",
      "home.hero.subtitle": "Elige tus números de la suerte, únete a sorteos globales y gana de forma segura — flujos simples y pagos transparentes.",
      "home.hero.getStarted": "Comienza Ahora",
      "home.nextDraw.title": "Próximo Sorteo",
      "home.nextDraw.subtitle": "¡No pierdas tu oportunidad de ganar en grande!",
      "home.nextDraw.playNow": "Jugar Ahora",
      "home.contact.title": "¿Listo para Ganar en Grande?",
      "home.contact.subtitle": "Únete a miles de ganadores en todo el mundo. Comienza hoy o contacta a nuestro equipo de soporte.",
      "home.contact.getInTouch": "Ponte en Contacto",
      "home.contact.followUs": "Síguenos",
      "home.contact.followSubtitle": "Mantente actualizado con los últimos sorteos y ganadores",
      "home.contact.startPlaying": "Comienza a Jugar",
      "home.contact.startPlayingDesc": "Únete a millones de jugadores en todo el mundo y comienza tu viaje ganador hoy.",
      "home.contact.getStarted": "Comenzar",
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
      
      // Home Page
      "home.hero.title": "Construisez votre avenir financier",
      "home.hero.subtitle": "Choisissez vos numéros chanceux, participez aux tirages mondiaux et gagnez en toute sécurité — processus simples et paiements transparents.",
      "home.hero.getStarted": "Commencer Maintenant",
      "home.nextDraw.title": "Prochain Tirage",
      "home.nextDraw.subtitle": "Ne manquez pas votre chance de gagner gros!",
      "home.nextDraw.playNow": "Jouer Maintenant",
      "home.contact.title": "Prêt à Gagner Gros?",
      "home.contact.subtitle": "Rejoignez des milliers de gagnants dans le monde entier. Commencez aujourd'hui ou contactez notre équipe de support.",
      "home.contact.getInTouch": "Contactez-nous",
      "home.contact.followUs": "Suivez-nous",
      "home.contact.followSubtitle": "Restez informé des derniers tirages et gagnants",
      "home.contact.startPlaying": "Commencer à Jouer",
      "home.contact.startPlayingDesc": "Rejoignez des millions de joueurs dans le monde et commencez votre voyage gagnant aujourd'hui.",
      "home.contact.getStarted": "Commencer",
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
