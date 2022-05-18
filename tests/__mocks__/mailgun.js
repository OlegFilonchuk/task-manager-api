class Mailgun {
  constructor(formData) {
    console.log(`new mailgun created from ${formData}`);
  }

  client({ username, key }) {
    console.log(`created new mailgun client with ${username} and ${key}`);

    const client = {
      messages: {
        create(domain, messageData) {
          console.log(domain);
          console.log(messageData);
        },
      },
    };
    return client;
  }
}

module.exports = Mailgun;
