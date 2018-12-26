const {watch} = require('./observable');


const recipe = {
  name: 'Pancake',
  minutesToMake: 15,
  ingredients: ['Baking Soda', 'Flour', 'Sugar', 'Milk', 'Oil', 'Cola'] // COLA ?!?!
}

// chained watching
watch(recipe)
  // ('*', (newValue, prop) => console.log('New Anything: ', newValue, prop))
  // ('minutesToMake', v => console.log('New Time:::', v))
  ('ingredients.*', (v, prop) => console.log('array!!!', v, prop))
  ('ingredients.1', (v, prop) => console.log('array mutated with 1!!!', v, prop))

recipe.ingredients[1] = 'dsds';

// recipe.minutesToMake = 35; // New Time: 35
// recipe.ingredients.unshift('pach');
// recipe.pach = {
//   control: {
//     a: "hello"
//   }
// }

recipe.ingredients = ['x1', 'x2'];