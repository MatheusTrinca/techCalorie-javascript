// ################## Storage Controller #####################
const StorageCtrl = (function(){

  //Public Methods
  return{
    storeItem: function(item){
      let items;
      if(localStorage.getItem('items') === null){
        items = []
        items.push(item);
      }else{
        // transforma JSON em objeto
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
      }
      // JSON só aceita string -> transformar em string(stringfy)
      localStorage.setItem('items', JSON.stringify(items));

    },

    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));

    },

    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(item.id === id){
          items.splice(index, 1)
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsFromStorage: function(){
      localStorage.clear();
    }

  }

})();



// ################## Item Controller #######################

const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  
  // Public Methods
  return{

    setCurrentItem: function(item){
      data.currentItem = item;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    getItems: function(){
      return data.items;
    },

    getItemById: function(id){
      let found = null;
      data.items.forEach(item => {
        if(item.id == id){
          found = item;
        }
      });
        return found;

    },

    updateItem: function(name, calories){
      // calories to number
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories
          found = item;
        }
      })

      return found;
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

    deleteItem: function(itemID){
      // pegar os ids do data.items
      const ids = data.items.map(function(item){
        return item.id;
      })

      // pegar o indice do itemID
      const index = ids.indexOf(itemID);

      // remover o item
      data.items.splice(index, 1);

    },

    clearAllItems: function(){
      data.items = [];
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



// ################## UI Controller ####################

const UICtrl = (function(){
  const UISelectors = {
    listItems: '#item-list li',
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
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
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}:</strong> <em>${item.calories} calorias</em>
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

    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      
      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}:</strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `
        }
      })
    },

    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(item => item.remove());
    },

    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
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

    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'block';
    },

    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function(){
      return UISelectors;
    }

  }
})();



// ##################### App Controller ############################

const App = (function(ItemCtrl, StorageCtrl, UICtrl){

  //Load EventListeners
  const loadEventListeners = function(){
    //get UIselectors
    const UISelectors = UICtrl.getSelectors();

    //Disable Enter
    document.addEventListener('keypress', e => {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })

    //Add item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Add Edit Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update submit item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemEditUpdate);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', function(e){
      e.preventDefault();
      UICtrl.clearEditState();
    });

    // Delete Button item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Limpar tudo
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);
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

      // save in Local Storage
      StorageCtrl.storeItem(newItem);

      UICtrl.showList();

      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  // Click Edit Item
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      const listId = e.target.parentElement.parentElement.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      // get Item to edit
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);

      // set item to form -> não precisa de parâmetro, porque já esta no currItem
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // Item Edit Update
  const itemEditUpdate = function(e){
    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();


    e.preventDefault();
  }

  // Item Delete Submit 
  const itemDeleteSubmit = function(e){

    const currItem = ItemCtrl.getCurrentItem();

    // delete from structure
    ItemCtrl.deleteItem(currItem.id);

    // delete from UI
    UICtrl.deleteListItem(currItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.deleteItemFromStorage(currItem.id);

    UICtrl.clearEditState();


    e.preventDefault();
  }

  // Clear All Items Event
  const clearAllItems = function(e){
    
    // delete all from data struture
    ItemCtrl.clearAllItems();

    //delete all from UI
    UICtrl.removeItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.clearEditState();

    StorageCtrl.clearItemsFromStorage();
    
    // Hide list
    UICtrl.hideList();

    e.preventDefault();
  }



  // Public Methods
  return{
    init: function(){
      //clear edit state
      UICtrl.clearEditState();
      
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

})(ItemCtrl, StorageCtrl, UICtrl);



// Initialize App
App.init();