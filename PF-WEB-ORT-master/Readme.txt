app.post(/completeform, req,res){

    const body = req;

    User.find----

    add del campo consulta

    creo un obj consulta

    user.consultas = consultaobjeto.id

    user.arancel =  arancel

}



/*----------------------TEST-------------------------*/


/*app.post('/api/mongodb',(req,res,next) => {
   
    const{ body } = req;
    
      const { 
      name,
      age
    } = body;

    
    const { 
        creator,
        title
      } = body;
   

        //Guardo el User. Creo el Objeto Users
        const newStory = new Story();
        newStory._creator = creator;
        newStory.title = title;
        newStory.save()
        .then((result) => {
          Person.findOne({ name: 'gabriel' }, (err, user) => {
              if (user) {
                  user.stories.push(newStory.title);
                  user.save();
                  res.json({ message: 'Object Created' });
              }
          });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });

});




*/