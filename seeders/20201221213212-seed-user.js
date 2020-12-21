'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface . bulkInsert ( 'Usuarios' , [{
      nombre: 'carlos' ,
      email: 'ejemplo@gmail.com' ,
      password: '$2y$10$aB098xmulPyn3VsAIE5af.B2ZByx83lhVXZpOz9jav6SShF0cKU.a' ,
      rol: 'Administrador',
      createdAt: new Date (),
      updatedAt: new Date ()
    }]);
  },

  down : async ( queryInterface , Sequelize ) => {
    return queryInterface . bulkDelete ( 'Usuarios' , null , {});
  }
};
