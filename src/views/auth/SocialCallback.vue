<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { createAccount } from '@/compositions/auth';


const router = useRouter();
const { SocailDataFetch, createAccountFromSocialite } = createAccount();

function generateAuthToken() {
  // Implement a robust token generation method
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
}

async function fetchSocialUserData(provider, accessToken) {
  try {
    let response;
    switch (provider) {
      case 'google':
        response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
        );
        break;
      case 'facebook':
        response = await fetch(
          `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${accessToken}`
        );
        break;
      default:
        throw new Error('Unsupported provider');
    }

    if (!response.ok) throw new Error('Failed to fetch user data');

    const userData = await response.json();
    return {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.email.split('@')[0],
    };
  } catch (error) {
    console.error('Error fetching social user data:', error);
    // Implement user-friendly error handling here
    return null;
  }
}

onMounted(async () => {
  setTimeout(async () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    const accessToken =
      hashParams.get('access_token') || queryParams.get('access_token');

    if (!accessToken) {
      console.error('No access token found!');
      router.push({ name: 'login' });
      return;
    }

    // Check if user already has an auth token
    let storedToken = localStorage.getItem('invoicepro_token');
    if (!storedToken) {
      const authToken = generateAuthToken();
      localStorage.setItem(
        'invoicepro_token',
        JSON.stringify({ auth_token: authToken })
      );
    }

    window.location.hash = '';

    const provider = localStorage.getItem('social_provider');
    if (!provider) {
      console.error('No social provider information found.');
      router.push({ name: 'login' });
      return;
    }

    const socialData = await fetchSocialUserData(provider, accessToken);
    if (!socialData) {
      console.error('Failed to fetch social user data.');
      router.push({ name: 'login' });
      return;
    }

    const newUserData = createAccountFromSocialite(socialData);
    if (newUserData) {
      SocailDataFetch(newUserData);
      localStorage.removeItem('social_provider');
    } else {
      console.error('Failed to create user account from social data.');
      router.push({ name: 'login' });
    }
  }, 500); // Delay for safety
});
</script>
