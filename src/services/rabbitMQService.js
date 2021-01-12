import CONFIG from "../config";


export default {
  sender: ({ queueName, queueData, mode }) => {
    try {
      console.log({ queueName, queueData, mode })
      const rabbitMqUrl = ( mode === 'server' ) ? CONFIG["RABBITMQ_SERVER_URL"] : CONFIG["RABBITMQ_LOCAL_URL"];
      const open = require("amqplib").connect(rabbitMqUrl);
      queueData = typeof queueData === "object" ? queueData : null;
      if (!queueData) {
        return;
      }
      queueData = JSON.stringify(queueData);
      open
        .then(function (conn) {
          return conn.createChannel();
        })
        .then(function (ch) {
          return ch.assertQueue(queueName).then(function (ok) {
            return ch.sendToQueue(queueName, Buffer.from(queueData));
          });
        })
        .catch(console.warn);
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  receiver: ({queueName, mode}) =>{
    try {
      const rabbitMqUrl = ( mode === 'server' ) ? CONFIG["RABBITMQ_SERVER_URL"] : CONFIG["RABBITMQ_LOCAL_URL"];
      const open = require("amqplib").connect(rabbitMqUrl);
      open.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        // console.log(ch);
        return ch.assertQueue(queueName).then(function(ok) {
          console.log(ok);
          return ch.consume(queueName, function(msg) {
            console.log(msg);
            if (msg !== null) {
              console.log(msg.content.toString());
              ch.ack(msg);
              return msg;
            }
          });
        });
      }).catch(console.warn);
    } catch (error) {
      console.log(error);
    }
  }
};
