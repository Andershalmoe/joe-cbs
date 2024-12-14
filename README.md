# ChristmasJoe

Dette projekt er udviklet med det formål at supplere en eventuel Joe and the Juice-app i juleperioden med en julekalender.
Det er en Node.js-webapplikation, udviklet med Node v20.11.1.

# Funktioner
Julekalenderen er oprettet til at køre i tidsrummene:
01.-24. december 2024 & 01.-24. januar 2025. Dette er i forbindelse med tidsrummet til et eksamensprojekt.

- Integration med eksterne API'er som Twilio til SMS-verifikation og Nodemailer til e-mails.
- Beskyttelse af ruter med JWT og rate limiting for sikkerhed.
- MySQL-database til håndtering af brugere og låger.
- Ved anvendelse anvend app.js




# Miljøvariabler 
Følgende miljøvariabler skal defineres i en .env-fil for at web-applikationen kan fungere korrekt.

TWILIO_ACCOUNT_SID=     # Twilio-kontoens SID

TWILIO_API_KEY_SID=     # Twilio API nøgle

TWILIO_PHONE_NUMBER=    # Telefonnummer registreret hos Twilio

TWILIO_API_KEY_SECRET=  # Hemmeligt Twilio API-nøgle


MYSQL_HOST=             # Værtsadresse til MySQL-databasen

MYSQL_USER=             # Brugernavn til MySQL

MYSQL_PASSWORD=         # Kodeord til MySql

MYSQL_DATABASE=         # Navn på databasen

MYSQL_PORT=             # Porten til MySQL

JWT_SECRET=             # Nøglen brugt til at signere JWTokens

NODE_ENV=               # Miljø

EMAIL_USER=             # E-mail til nodemailer

EMAIL_PASS=             # Adgangskode til E-mailkonto

PORT=                   # Portnummer hvor serveren skal køre

# Moduler
Appen gør brug af ES6 moduler hvorfor "type": skal sættes til "module"

Disse moduler skal downloades med "npm install ***":

    "bcryptjs": "^2.4.3",
   
    "cookie-parser": "^1.4.7",
    
    "cors": "^2.8.5",
    
    "dotenv": "^16.4.5",
    
    "express": "^4.21.1",
    
    "express-rate-limit": "^7.4.1",
    
    "jsonwebtoken": "^9.0.2",
    
    "mysql": "^2.18.1",
    
    "mysql2": "^3.11.5",
    
    "nodemailer": "^6.9.16",
    
    "twilio": "^5.3.6",
    
    "uuid": "^11.0.3"

    "nginx version:" "nginx/1.26.0 (Ubuntu),


# Simulering af vouchere

Test foretaget for at simulere sikkerheden i webapplikationen:

validateVoucherRoute.js er ruten /validate brugt til at simulerer, en indløsning af en voucher-kode fra 'butikkens side'.
Dette har altså ingen reel funktionalitet for brugeren af webapplikationen.
