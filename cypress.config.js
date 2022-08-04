import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      login_url: '/login',
      signup_url: '/register',
      cart_url: '/cart',
      shipping_url: '/shipping',
      payment_url: '/payment',
      placeorder_url: '/placeorder',
      cus_email: 'panh@gmail.com',
      cus_pass: '123456',
      ad_email: 'admin@example.com',
      ad_pass: '123456'
    },
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false
  },
});
