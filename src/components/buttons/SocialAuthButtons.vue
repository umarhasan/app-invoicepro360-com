<template>
  <div class="social-login-buttons">
    <button @click="handleSocialLogin('facebook')" type="button" class="facebook-btn btn btn-secondary w-half mr-3 align-top">
        <Lucide icon="Facebook" class="w-4 h-4 mr-2" />Facebook
    </button>
    <button @click="handleSocialLogin('google')" type="button" class="google-btn btn btn-secondary w-half ml-3 align-top">
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-google mr-2 w-4 h-4">
        <path d="M21.8,10h-2.6l0,0H12v4h5.7c-0.8,2.3-3,4-5.7,4c-3.3,0-6-2.7-6-6s2.7-6,6-6c1.7,0,3.2,0.7,4.2,1.8l2.8-2.8C17.3,3.1,14.8,2,12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10C22,11.3,21.9,10.6,21.8,10z"></path>
      </svg> Google
    </button>
    <button @click="handleSocialLogin('apple')" type="button" class="apple-btn btn btn-secondary w-half ml-3 align-top">
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-apple mr-2 w-4 h-4">
        <path d="M16 13c-.3 3 2.3 4 2.4 4-1 2-2.6 3-4.8 3-2.4 0-3.2-1.6-5-1.6-1.9 0-3.1 1.7-4.9 1.7C1.6 20 .2 17 .2 15c0-2.9 2.3-4.4 4.5-4.4 1.4 0 2.5.8 3.3.8s2-.8 3.5-.8c1.6 0 3.1.8 3.9 2.3z"></path>
      </svg> Apple
    </button>
  </div>
</template>

<script setup>
import config from "@/config";

const handleSocialLogin = (provider) => {
  const state = Math.random().toString(36).substring(7);

  // Store the provider in localStorage so that SocialCallback.vue can later use it
  localStorage.setItem("social_provider", provider);

  let authUrl = "";

  if (provider === "google") {
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      config.GOOGLE_REDIRECT
    )}&response_type=token&scope=profile email&state=${state}`;
  } else if (provider === "facebook") {
    authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${config.FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      config.FACEBOOK_REDIRECT
    )}&response_type=code&scope=email,public_profile&state=${state}`;
  } else if (provider === "apple") {
    authUrl = `https://appleid.apple.com/auth/authorize?client_id=${config.APPLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      config.APPLE_REDIRECT
    )}&response_type=code&scope=name%20email&state=${state}`;
  }
  
  window.location.href = authUrl;
};
</script>

<style scoped>
.btn {
  padding: 10px;
  margin: 5px;
  border: none;
  cursor: pointer;
}
.google-btn {
  background-color: #db4437;
  color: white;
}
.facebook-btn {
  background-color: #3b5998;
  color: white;
}
.apple-btn {
  background-color: #000000;
  color: white;
}
</style>
