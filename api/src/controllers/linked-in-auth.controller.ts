import { inject } from '@loopback/core';
import { get, param, Response, RestBindings } from '@loopback/rest';
import axios from 'axios';

export class LinkedInAuthController {
  constructor() {}

  @get('/auth/linkedin')
  async callLinkedIn(
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    try {
      const clientId = '77tnxxhpo1tiap';
      const redirectUri = encodeURIComponent('http://localhost:3000/auth/linkedin/callback');
      const scope = encodeURIComponent('openid profile email');
      const state = '1234'; // you can generate a random string here for security
      
      const linkedinAuthUrl = 
        `https://www.linkedin.com/oauth/v2/authorization?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&scope=${scope}` +
        `&state=${state}`;

      // Redirect the user’s browser to LinkedIn for login
      response.redirect(linkedinAuthUrl);
    } catch (error) {
      console.error('Error while redirecting to LinkedIn auth:', error);
      response.status(500).send('Internal Server Error');
    }
  }

  @get('/auth/linkedin/callback')
  async linkedInCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    try {
      if (!code) {
        response.status(400).send('Missing authorization code');
        return;
      }

      const clientId = '77tnxxhpo1tiap';
      const clientSecret = 'WPL_AP1.xELrw18Fv89ZRkFq.92ZP/A==';
      const redirectUri = 'http://localhost:3000/auth/linkedin/callback';

      // Exchange code for access token
      const tokenResponse : any = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null, // no body for form-data
        {
          params: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const accessToken = tokenResponse.data.access_token;

      if (!accessToken) {
        response.status(400).send('Failed to get access token');
        return;
      }

      // Use the access token to fetch user profile info
      const profileResponse = await axios.get(
        'https://api.linkedin.com/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const emailResponse : any = await axios.get(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const profile = profileResponse.data;
      const email = emailResponse.data.elements[0]['handle~'].emailAddress;

      // Here you can find or create user in your DB based on email or LinkedIn ID
      // Then generate your JWT or session token

      console.log('profile info', profile);
      console.log('email info', email);

      // For now, just redirect or respond with some user info
      response.redirect(`http://localhost:3030/success?email=${email}&profile=${profile}`);

    } catch (error) {
      console.error('Error in LinkedIn callback:', error);
      response.status(500).send('Authentication failed');
    }
  }
}
