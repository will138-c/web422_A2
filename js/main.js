/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: __Zhan Wang_____________ Student ID: __148668171____________ Date: ___2021-2-1_____________
*
*
********************************************************************************/


let restaurantData= [];
var currentRestaurant = [];
var page = 1;
var perPage = 10;
var map = null;


function avg(grades){
    var sum = 0;
    for(var i= 0; i< grades.length;i++){
        sum += grades[i].score;
    }

    return (sum/grades.length).toFixed(2);
}

var tableRows = _.template(
    `<% _.forEach(restaurantData, function(restaurants){ %>
        <tr data_id=<%- restaurants._id %>>
            <td><%- restaurants.name %></td>
            <td><%- restaurants.cuisine%></td>
            <td><%- restaurants.address.building %> <%- restaurants.address.street %></td>
            <td><%- avg(restaurants.grades)%></td>     
        </tr>
   <% }); %>`
   
);


function loadRestaurantDate(){
    fetch(`http://web422assignment01.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
    .then(res => res.json())
        //console.log(response.json()
    .then ((myJson)=>{
       // console.log(myJson);
        restaurantData = myJson;
        let rows = tableRows(restaurantData);
        $("#restaurant-table tbody").html(rows);
        //console.log(rows);
        $("#current-page").html(page);
    })
    .catch(err => console.error('Unable to load restaurants data:', err))
}




// Previous page button
$("#previous-page").on("click", function(e) {
    if (page > 1) {
        page--;
    }
    loadRestaurantDate();
});

// Next page button
$("#next-page").on("click", function(e) {
    page++;
    loadRestaurantDate();
});


function getRestaurantModelById(id){

    for(let i =0; i < restaurantData.length; i++){
        if(restaurantData[i]._id == id){
            return _.cloneDeep(restaurantData[i]);
        }

    }
    return null;
}
    
    

    $("#restaurant-table tbody").on("click","tr",function(){

          
         currentRestaurant = getRestaurantModelById($(this).attr("data_id"));
         
         console.log(currentRestaurant); 

    
    
     $('#restaurant-modal').modal( {
            backdrop:'static',
            keyboard: false
         });
    
        
     $("#restaurant-modal h4").html(`${currentRestaurant.name}`);
    
     $("#restaurant-address").html(`${currentRestaurant.address.building} ${currentRestaurant.address.street}`)
   
     $("#restaurant-modal").on('shown.bs.modal', function () {


        map = new L.Map('leaflet', {
            center: [currentRestaurant.address.coord[1],currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
                new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
            })
            console.log(currentRestaurant.address.coord[1]);
            console.log(currentRestaurant.address.coord[0]);
            L.marker([currentRestaurant.address.coord[1],currentRestaurant.address.coord[0]]).addTo(map);
    
        });

       
     
    });

    $("#restaurant-modal").on('hidden.bs.modal',function(){
        map.off;
        map.remove();
    })



// Document is ready
   
$(function() {

    // Load data into page
    loadRestaurantDate();
    
});


