// Storage Controller



// Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 400},
      // {id: 2, name: 'Eggs', calories: 300},
    ],
    currentItem: null,
    totalCalories: 0
  }
  
  // Public Methods
  return{
    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      // Create ID
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      }else{
        ID = 0;
      }

      // Calories to Number
      calories = parseInt(calories);

      // Create New Item
      const newItem = new Item(ID, name, calories);
      
      // Push into array
      data.items.push(newItem);
      
      // Retornando para usar no UI
      return newItem;



    },

    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      })
      data.totalCalories = total;
      return data.totalCalories;
    },

    logData: function(){
      return data;
    }
  }

})();



// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }


  //Public Methods
  return{
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `
          <li class="collection-item" id="${item.id}">
            <strong>${item.name}:</strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      })
      //Inserting items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return{
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item){
      //Create li Element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}:</strong> <em>${item.calories} calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      //Inserting item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li); //appendChild
    },

    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'block';

    },

    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    getSelectors: function(){
      return UISelectors;
    }

  }
})();



// App Controller
const App = (function(ItemCtrl, UICtrl){

  //Load EventListeners
  const loadEventListeners = function(){
    //get UIselectors
    const UISelectors = UICtrl.getSelectors();
    //Add item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  //Add ItemSubmit
  const itemAddSubmit = function(e){
    // Get form Input from UIController
    const input = UICtrl.getItemInput();
    
    //Check name and calories input
    if(input.name !== '' && input.calories !== ''){
      //AddItem
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add no UIList
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      UICtrl.showList();

      UICtrl.clearInput();

    }

    e.preventDefault();
  }


  // Public Methods
  return{
    init: function(){
      console.log('Initialized');
      
      // Fetching from data Structure
      const items = ItemCtrl.getItems();

      // check any items
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        //Populete with fetched items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      //Init LoadEventListeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);



// Initialize App
App.init();