(function(global) {
  'use strict';

  global._ = {};

  _.identity = ( val => val );

  _.first = ( ( array, n ) => n === undefined ? array[0] : array.slice(0, n) )

  _.last = ( ( array, n ) => {
      if( n === 0 ){
        return [];
      } else {
        return n === undefined ? array[array.length-1] : array.slice(-n) 
      }     
    });

  _.each = (collection, iterator) => {
    if(Array.isArray(collection)){
      for( let i =0 ; i < collection.length ; i++){
        iterator(collection[i],i,collection);
      }
    } else {
      for(let key in collection){
        iterator(collection[key],key,collection)
      }
    }
  }

  _.indexOf = (array, target) => {

    let result = -1;
    _.each(array, (item, index) => {
      if (item === target && result === -1) {
        result = index;
      }
    });
    return result;
  };

  _.filter = (collection, test) =>{  
    let filttered = [];
    _.each(collection,item=> test(item) ? filttered.push(item) : false)
    return filttered;
  };

  _.reject = (collection, test) => _.filter(collection,x => !test(x));
 
  _.uniq = (array) => {
    let newArr = [];
    _.each(array,item=>{
      if(!newArr.includes(item)){
        newArr.push(item)
      }
    })
    return newArr;
  };

  _.map = (collection, iterator) =>{
    let newArr = [];
    _.each(collection,(item)=>newArr.push(iterator(item)))
    return newArr
  }

  _.pluck = (collection, key) => _.map(collection, item => item[key]);

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as its second argument.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  //
  //   var identity = _.reduce([5], function(total, number){
  //     return total + number * number;
  //   }); // should be 5, regardless of the iterator function passed in
  //          No accumulator is given so the first element is used.
  _.reduce = (collection, iterator, accumulator)=>{
    let isFirst = true
    _.each(collection,(item,idx,arr)=>{    
      if(accumulator===undefined&&isFirst){
        accumulator = item;
        isFirst = false;
      } else {
        accumulator=iterator(accumulator,item,idx,arr)
      }      
    })
    return accumulator;
  };

  _.contains = (collection, target) => _.reduce(collection, (wasFound, item)=> wasFound ? true : item === target ,false)
  
  _.every = (collection, iterator) => (
    _.reduce(collection,(acc,item,idx,col)=>{
      iterator = iterator || _.identity;
      return !acc ? false : !!iterator(item);   
    },true)
  );

  _.some = (collection, iterator) => (
    !_.every(collection,(x)=>{
      iterator = iterator || _.identity;
      return !iterator(x);
    })
  );


 
  _.extend = function(obj,...arg) {
    let newObj = obj;
    for( let i = 0 ; i < arg.length ; i++){
      for( let key in arg[i]){
        newObj[key] = arg[i][key]
      }
    }
    return newObj;
  };

  _.defaults = function(obj,...arg) {
    let newObj = obj;
    for( let i = 0 ; i < arg.length ; i++){
      for( let key in arg[i]){
        if(!newObj.hasOwnProperty(key))
        newObj[key] = arg[i][key]
      }
    }
    return newObj;
  };


  _.once = function(func) {
    var alreadyCalled = false;
    var result;

    return function() {
      if (!alreadyCalled) {
        result = func.apply(this,arguments);
        alreadyCalled = true;
      }
      return result;
    };
  };

  _.memoize = function(func) {
    let cache = {};
    
    return function(...arg){
      let argu = JSON.stringify(arg)
      if(!(argu in cache)){
        cache[argu] = func.apply(this,arguments);
      }
      return cache[argu]
    }
  };

  _.delay = function(func,wait,...arg) {

    // call, apply, bind 개념
    // setTimeout.call(this,arguments)  // fail, call 뒤에 array가 오면 안됨
    // setTimeout.call(this,func,wait,arg[0],arg[1]);  // ok, call 뒤에 array가 아닌 arguments를 연속으로 받음
    // setTimeout.apply(this,arguments) // ok, apply 뒤에 array가 와서 정상 동작함
    // setTimeout.apply(this,func,wait,arg); //fail, apply 사용 시 this 뒤 (func 자리)에 arr가 와야함, 
                                     //ㄴ array가 아니라도 정상동작 하는 것으로 보이나(func는 정상 호출) 여기에 제시된 func는 arg가 반드시 필요함
    // setTimeout.apply(this,[func,wait,arg[0],arg[1]]);   //ok, apply 사용시 array 가 옴 
    // setTimeout(func.bind(this,arg[0],arg[1]),wait)  //ok, bind 하면 실행하지 않고 연결했다가 callback 실행시 호출 됨

    // call back 함수 의 개념
    // setTimeout(func(arg[0],arg[1]),wait); // fail, 2번 통과, func에 arg를 잘 전달 했으나, 1번째 인자로 함수를 전달하지 않고 즉시 실행 함
    // setTimeout(func.apply(this,arg),wait)  // fail, 2번 통과, apply의 개념에 문제없으나, 1번째 인자로 함수를 전달하지 않고 즉시 실행 함
    // setTimeout(func.bind(this,arg[0],arg[1]),wait)  //ok, bind 하면 실행하지 않고 연결했다가 callback 실행시 호출 됨
    // setTimeout(function(){ func(arg[0],arg[1]) },wait); // ok, wait 후 callback 함수를 실행하고 함수내에서 arg를 전달한 func를 실행
    // setTimeout(function(){ func.apply(this,arg) },wait)// ok, wait 후 callback 함수를 실행하고 함수내에서 arg를 전달한 func를 실행
   
    // return의 개념
    // return은 고려할 필요없음, timer의 id 가 return 될 뿐이고 setTimeout을 잘 실행하기만 하면됨, _.each 처럼
    // return을 해도 동작함, 안해도 동작함

    // setTimeout 함수의 개념
    // setTimeout(func,wait)  // fail (1번 통과) 대기후 실행됨 argument 전달안됨
    // setTimeout(func,wait,arg[0],arg[1]); // ok, argument를 넣어 주기만 하면 1자리는 func, 2자리는 시간, 3 자리 이후 는 callback의 argument로 알아서 정리됨
    setTimeout.apply(null,arguments) // ok, 위와 동일함
    
          
    // this, null 개념
    // setTimeout.apply(arguments);  //fail this 써야함
    // setTimeout.apply(this,arguments) // ok, this, null 모두에서 동작
    // setTimeout.apply(null,arguments) // ok, this, null 모두에서 동작

    // Array.prototype.slice.call(arguments,1,10)   
    // ㄴ ok, arguments를 arr로 바꿀 때 사용한다. 위의 this가 여기서는 arguments가 되었고 1,10은 slice method에 전달하는 argument의 개념
    // Array.prototype.slice.call(array,arguments)  이런 개념으로 이해하면 좀 더 직관적인듯.

  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */


  _.shuffle = function(array) {
    let cpdArr = array.slice(0)
    let shuffledArr = [];
    let k=Math.trunc(Math.random() * (cpdArr.length)); 
    
    while(cpdArr.length !== 0){
      shuffledArr.push(cpdArr[k]);
      cpdArr.splice(k,1);    
      k=Math.trunc(Math.random() * (cpdArr.length));
    }
    return shuffledArr
  };


  _.invoke = (collection, functionOrKey, args) => (
    typeof(functionOrKey)==='function' ? 
    _.map(collection,(item,idx,col)=> functionOrKey.call(item)) : _.map(collection,(item,idx,col)=> String.prototype[functionOrKey].call(item)))


_.sortBy = function(collection, iterator) {
    let temp;
    
    if(iterator === 'length'){
      iterator = (x)=> (x.length);
    }

    for(let i = 0 ; i < collection.length ; i++){
      for(let j = i+1 ; j < collection.length ; j++){
        if(String(iterator(collection[i]))>String(iterator(collection[j]))){
          temp = collection[i];
          collection[i] = collection[j];
          collection[j] = temp
        }         
      }
    }
    return collection

  };


  _.zip = function(...arg) {   // maxidx를 꼭 따로 구해야하는지
    var zippedArr = []
    var newArr = []
    var argLength = _.map(arg,(item)=> item.length)
    var maxIdx = Math.max.apply(null,argLength)
    
    for(var i = 0 ; i < arg.length ; i++){
      newArr = []
      for(var j = 0 ; j < maxIdx ; j++){
        newArr.push(arg[j][i])
      }
      zippedArr.push(newArr)
    }
    return zippedArr;
  };


  _.flatten = function(nestedArray, result) {
    var flattenedArr = [];

    (function makeArr(testArr){
      for(var i = 0 ; i < testArr.length ; i++){
        if(Array.isArray(testArr[i])){
          makeArr(testArr[i]);
        } else {
          flattenedArr.push(testArr[i]);
        }
      }
    })(nestedArray)

    return flattenedArr;
  };
  
  _.intersection = function(...argu) {  // arrow 말고 _연속 쓰는 방법???
    var totalEl = _.uniq(_.flatten(argu))
    return _.filter(totalEl,(totalItem)=>(_.every(argu,(arguItem)=>arguItem.includes(totalItem)))) 
  }


  _.difference = function(array) {
    var argu = Array.prototype.slice.call(arguments,1)
        
    return _.filter(arguments[0],function(item){
      return !_.some(argu,function(arguItem){
        return arguItem.includes(item)
      })
    }) 
  };


  _.throttle = function(func, wait) {

    var alreadyCalled = false;

    return function() {
      if (!alreadyCalled) {
        setTimeout(initial,wait);
  
        function initial(){
          alreadyCalled = false
        }

        alreadyCalled = true;
        func.apply(this, arguments);
      }
    };
  };

  if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = global._;
  }
}( typeof window !== "undefined" ? window : global ));
