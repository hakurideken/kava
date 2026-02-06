const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!slackWebhookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Slack webhook URL not configured' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const timestamp = new Date().toLocaleString('cs-CZ', { 
      timeZone: 'Europe/Prague',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const slackMessage = {
      text: '☕ Někdo přijal pozvání na kávu!',
      attachments: [{
        color: '#36a64f',
        fields: [
          {
            title: 'Akce',
            value: 'Pozvání na kávu přijato ✅',
            short: true
          },
          {
            title: 'Čas',
            value: timestamp,
            short: true
          },
          {
            title: 'IP Adresa',
            value: data.ip || 'Neznámá',
            short: true
          },
          {
            title: 'Prohlížeč',
            value: data.userAgent || 'Neznámý',
            short: true
          }
        ],
        footer: 'Coffee Invitation App',
        footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png'
      }]
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage)
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Notification sent to Slack' })
    };

  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
};
