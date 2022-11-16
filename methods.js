function diff_minutes(checkOutTime, checkInTime) 
 {

  let diff =(checkOutTime.getTime() - checkInTime.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }

 module.exports = diff_minutes