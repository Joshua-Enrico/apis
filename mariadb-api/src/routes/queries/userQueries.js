const {prisma} = require('@prisma/client');

// eslint-disable-next-line require-jsdoc
async function getAllUsers() {
  await prisma.users.findMany()
      .then((users) => {
        return users;
      })
      .catch((err) => {
        throw new Error(err);
      });
}

exports.modules = {getAllUsers};
