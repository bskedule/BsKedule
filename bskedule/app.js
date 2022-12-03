let body = document.body;
let yourCalender = document.getElementById("calendar");
let raw
let preRaw
let coursesPattern = /([A-Z]{2,2}\d{4,4})\t([^\t]+)\t([\d-]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^A-Z]+)/g
let examsPattern = /([^\t\s]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t]+)\t([^\t\s]+)/g
let scheduleWraper = document.createElement('div')
scheduleWraper.setAttribute('class', 'scheduleWraper')
body.appendChild(scheduleWraper)
let selectedWeek = (week(new Date()))%53
let detailedCards = []
let coursesSchedule = []
let examsSchedule = []
let eventSchedule = []

if(localStorage.getItem('coursesSchedule'))
{
    coursesSchedule = JSON.parse(localStorage.getItem('coursesSchedule'))
}
if(localStorage.getItem('examsSchedule'))
{
    examsSchedule = JSON.parse(localStorage.getItem('examsSchedule'))
}
if(localStorage.getItem('eventSchedule'))
{
    eventSchedule = JSON.parse(localStorage.getItem('eventSchedule'))
}

// Create lines
for(let row = 0; row < 47; row++)
{
    let rect = document.createElement('div');
    rect.setAttribute('class', 'row');
    rect.setAttribute('style', `top:${row*25}px; left:0; border-color:black;`)
    yourCalender.appendChild(rect)
}
// Create times on the left side
for(let row = 0; row < 24; row++)
{
    let hours = document.createElement('p')
    hours.innerText = row + 1 + ':00'
    hours.setAttribute('style', `position:absolute; top:${row*50 + 25}px; left:-5vw;`)
    yourCalender.appendChild(hours)
}

// String 1 modification
function letterModify(theString) {
    // Sentence case
    let newString = theString.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g,function(c){return c.toUpperCase()});
    // No abbreviation
    let abbreviationCode = ["(tn)", "(th)", "(bt)"];
    let fullCode = ["(thí nghiệm)", "(thực hành)", "(bài tập)"];
    for (let i=0; i<fullCode.length; i++){
        if (newString.includes(abbreviationCode[i])){
            newString = newString.replace(abbreviationCode[i], fullCode[i]);
        }
    }
    // Vietnamese
    let nonViet = ["Giai tich", "He thong", "Ki thuat", "ki thuat", "Nhap mon", "dien toan", "Co so", "so", "Vat li", "vat lieu", "ban dan", "Hoa", "hoc", "dai cuong", "Tieng Nhat", "Co hoc", "Ly thuyet", "ly thuyet"];
    let forViet = ["Giải tích", "Hệ thống", "Kĩ thuật", "kĩ thuật", "Nhập môn", "điện toán", "Cơ sở", "số", "Vật lí", "vật liệu", "bán dẫn", "Hoá", "học", "đại cưong", "Tiếng Nhật", "Cơ học", "Lý thuyết", "lý thuyết"];
    for (let i=0; i<nonViet.length; i++){
        if (newString.includes(nonViet[i])){
            newString = newString.replace(nonViet[i], forViet[i]);
        }
    }
    return newString;
}
// String 2 modification
function contentModify(theString){
    if (theString.includes("SAN")){
        newString=theString.replace("SAN", "sân");
        return newString;
    }
    return theString;
}

// Create lecture card
function createCard(t, d, x, y, w, h, c)
{
    let div = document.createElement('div')
    // p1 content is t - stands for title   
    let p1 = document.createElement('p')
    p1.setAttribute('style', 'font-size:90%; margin:5px 5px 5px 5px;')
    p1.innerText = t
    div.appendChild(p1)
    // p2 content is d - stands for description
    let p2 = document.createElement('p')
    p2.setAttribute('style', 'font-size:xx-small; margin: 5px 5px 5px 5px;')
    p2.innerText = d
    div.appendChild(p2)
    // div is card
    div.setAttribute('class', 'card')
    div.setAttribute('style','background-color:' + c )
    div.style.width = w
    div.style.height = h
    div.style.top = y
    div.style.left = x
    return div
}

function week(dt) 
{
    var tdt = new Date(dt.valueOf());
    var dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) 
    {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

function createDetailedCard (data)
{     
    let coefficence = 50;
    let lesson = letterModify(data[0]);
    let content = contentModify(data[1]);
    let times = data[3].split(' - ');
    let start = times[0].split(':');
    let end = times[1].split(':');
    let position = (start[0]*1 + start[1]/60)*coefficence;
    let size = ((end[0]*1 + end[1]/60) - (start[0]*1 + start[1]/60))*coefficence;
    // t = data[0]
    // d = data[1]
    // x = (data[2]-2)*100+50 px
    // y = position
    // w = 95px ~ 10vw
    // h = size
    // c = data[5]
    let card = createCard(lesson, content, (12*data[2]-13) +"vw", position + "px", "10vw", size+"px", data[5]);
    return card
}

function updateSchedule()
{
    if (detailedCards.length != 0)
    {
        detailedCards.forEach( card =>
        {
            scheduleWraper.removeChild(card)
        })
        detailedCards = []
    }
    coursesSchedule.forEach( data =>{
    
        if (data[4].includes(selectedWeek+''))
        {
            detailedCards.push(createDetailedCard(data))
        }
    })

    examsSchedule.forEach( data =>{    
        if (data[4].includes(selectedWeek+''))
        {
            detailedCards.push(createDetailedCard(data))
        }
    })
    eventSchedule.forEach( data =>{
    
        if (data[4].includes(selectedWeek+''))
        {
            detailedCards.push(createDetailedCard(data))
        }
    })

    detailedCards.forEach(card =>{
        scheduleWraper.appendChild(card)
    })
    document.querySelector('.weekText').innerText = 'Week ' + selectedWeek
}

function courseParsing(data)
{
    let lines = [];
    let line;
    parsedRaw = []
    courses = []
    while ((line = coursesPattern.exec(data)) !== null) {
        line[11] = line[11].split('|')
        parsedRaw.push(line.slice(1, 12))
      }
      for (i = 0; i < parsedRaw.length; i++)
        {
          courses.push([parsedRaw[i][1], 'mã ' + parsedRaw[i][0] + '\nlớp ' + parsedRaw[i][4] + '\n phòng ' + parsedRaw[i][8], parsedRaw[i][5], parsedRaw[i][7], parsedRaw[i][10], '#ffffff'])
        }
    return courses
}

function examsParsing(data)
{
    let lines = [];
    let line;
    parsedRaw = []
    exams = []
    while ((line = examsPattern.exec(data)) !== null) {
        parsedRaw.push(line.slice(1, 12))
      }
    parsedRaw.forEach(s =>{
        if (s[3] != '/')
        {
            splittedDate = s[3].split('/')
            dayOfMonth = splittedDate[0]
            month = splittedDate[1]
            today = new Date()
            thisYear = today.getFullYear()
            dateOfExam = new Date(`${thisYear}-${month}-${dayOfMonth}`)
            weekOfExam = week(dateOfExam)
            dayOfExam = dateOfExam.getDay()
            dayOfExam = dayOfExam == 0 ? 8 : dayOfExam + 1
            timeOfExam = `${s[4].replace('g', ':')} - ${s[4].split('g')[0]*1+2}:00`
            exams.push(['Thi giữa kì' + s[1], `mã ${s[0]}\nnhóm-tổ ${s[2]}\nphòng ${s[5]}`, dayOfExam, timeOfExam, [weekOfExam+''], '#ffffff'])
        }        
        if (s[6] != '/')
        {
            splittedDate = s[6].split('/')
            dayOfMonth = splittedDate[0]
            month = splittedDate[1]
            today = new Date()
            thisYear = today.getFullYear()
            dateOfExam = new Date(`${thisYear}-${month}-${dayOfMonth}`)
            weekOfExam = week(dateOfExam)
            dayOfExam = dateOfExam.getDay()
            dayOfExam = dayOfExam == 0 ? 8 : dayOfExam + 1
            timeOfExam = `${s[7].replace('g', ':')} - ${s[7].split('g')[0]*1+2}:00`
            exams.push(['Thi cuối kì' + s[1], `mã ${s[0]}\nnhóm-tổ ${s[2]}\nphòng ${s[8]}`, dayOfExam, timeOfExam, [weekOfExam+''], '#ffffff'])
        }
    })
    return exams
    
}

function handlingImport()
{
    raw = localStorage.getItem('rawData');
    console.log("OK");
    if (coursesPattern.test(raw))
    {
        coursesSchedule = courseParsing(raw)
    }
    else if (examsPattern.test(raw))
    {
        examsSchedule = examsParsing(raw)
    }
    else 
    {
        return
    }
    updateSchedule()
}

let colorOptions = ['#ffffff', '#00cccc', '#8ECAE6', '#219EBC', '#023047', '#FFB703', '#FB8500']
let colorPanel = document.createElement('div')
colorPanel.setAttribute('class', 'colorPanel')
let closeColorPanel = document.createElement('button')
closeColorPanel.innerText = 'x'
closeColorPanel.setAttribute('class', 'button')
let colorPanelWraper = document.createElement('div')
colorPanelWraper.setAttribute('class', 'prompt colorPanelWraper')
colorPanelWraper.appendChild(colorPanel)
closeColorPanel.setAttribute('onClick', "document.querySelector('.colorPanelWraper').setAttribute('style', 'display:none;'); document.querySelector('.importButton').setAttribute('style', 'display:inline-block'); document.querySelector('.editButton').setAttribute('style', 'display:inline-block'); document.querySelector('.addButton').setAttribute('style', 'display:inline-block');")
colorPanel.appendChild(closeColorPanel)

function handlingColorPicking()
{
    colorPanelWraper.removeChild(colorPanel)
    colorPanel = document.createElement('div')
    colorPanel.setAttribute('class', 'colorPanel')
    colorPanel.appendChild(closeColorPanel)

    coursesSchedule.forEach((schedule, index) =>{
        optionWraper = document.createElement('div')
        optionWraper.setAttribute('class', 'optionWraper')
        colorTitle = document.createElement('p')
        colorTitle.setAttribute('class', 'colorTitle')
        colorTitle.innerText = schedule[0]
        optionWraper.appendChild(colorTitle)
        deleteSchedule = document.createElement('button')
        deleteSchedule.setAttribute('class', 'rectangularButton')
        deleteSchedule.setAttribute('style', 'color:white; background-color:#ff4343; font-size:12px; padding: 3px 3px; margin: 0px 3px;')
        deleteSchedule.innerText = 'xóa'    
        scheduleIndex = coursesSchedule.indexOf(schedule)
        deleteSchedule.setAttribute('onClick', `coursesSchedule.splice(${scheduleIndex}, 1); updateSchedule(); handlingColorPicking()`)
        optionWraper.appendChild(deleteSchedule)
        colorOptions.forEach( (color) =>{
        {
            button = document.createElement('button')
            button.setAttribute('class', 'button')
            button.setAttribute('style', 'background-color: ' + color)
            button.setAttribute('onClick', 'handlingColorPicking(); coursesSchedule[' + index + '][5] = "' + color + '"; updateSchedule()')
            optionWraper.appendChild(button)
        } 
        colorPanel.appendChild(optionWraper)

            })  
        })
    examsSchedule.forEach((schedule, index) =>{
        colorTitle = document.createElement('p')
        colorTitle.setAttribute('class', 'colorTitle')
        colorTitle.innerText = schedule[0]
        colorPanel.appendChild(colorTitle)
        deleteSchedule.setAttribute('class', 'rectangularButton')
        deleteSchedule.setAttribute('style', 'color:white; background-color:#ff4343;')
        deleteSchedule.innerText = 'xóa'    
        scheduleIndex = coursesSchedule.indexOf(schedule)
        deleteSchedule.setAttribute('onClick', `examsSchedule.splice(${scheduleIndex}, 1); updateSchedule(); handlingColorPicking()`)
        colorPanel.appendChild(deleteSchedule)
        colorOptions.forEach( (color) =>{
        {
            button = document.createElement('button')
            button.setAttribute('class', 'button')
            button.setAttribute('style', 'background-color: ' + color)
            button.setAttribute('onClick', 'handlingColorPicking(); examsSchedule[' + index + '][5] = "' + color + '"; updateSchedule()')
            colorPanel.appendChild(button)
        } 

            })  
        })
        eventSchedule.forEach((schedule, index) =>{
            colorTitle = document.createElement('p')
            colorTitle.setAttribute('class', 'colorTitle')
            colorTitle.innerText = schedule[0]
            colorPanel.appendChild(colorTitle)
            deleteSchedule.setAttribute('class', 'rectangularButton')
            deleteSchedule.setAttribute('style', 'color:white; background-color:#ff4343;')
            deleteSchedule.innerText = 'xóa'        
            scheduleIndex = coursesSchedule.indexOf(schedule)
            deleteSchedule.setAttribute('onClick', `eventSchedule.splice(${scheduleIndex}, 1); updateSchedule(); handlingColorPicking()`)
            colorPanel.appendChild(deleteSchedule)    
            colorOptions.forEach( (color) =>{
            {
                button = document.createElement('button')
                button.setAttribute('class', 'button')
                button.setAttribute('style', 'background-color: ' + color)
                button.setAttribute('onClick', 'handlingColorPicking(); eventSchedule[' + index + '][5] = "' + color + '"; updateSchedule()')
                colorPanel.appendChild(button)
            } 
    
                })  
            })
    colorPanelWraper.appendChild(colorPanel)
    save()
}
colorPanelWraper.setAttribute('style', 'display:none')
body.appendChild(colorPanelWraper)

function addEvent()
{
    startHour = document.querySelector('.startHour').value * 1
    endHour = document.querySelector('.endHour').value * 1
    startMinute = document.querySelector('.startMinute').value * 1
    endMinute = document.querySelector('.endMinute').value * 1
    eventTitle = document.querySelector('.eventTitle').value
    eventContent = document.querySelector('.eventContent').value
    dayField = document.querySelector('.day').value * 1
    if(startHour >= 0 && startHour <= 23 && endHour >= 0 && endHour <= 23 && (startHour < endHour || (startHour == endHour && startMinute < endMinute)) && startMinute >= 0 && startMinute <= 59 && endMinute >= 0 && endMinute <= 59)
    {
        eventSchedule.push([eventTitle, eventContent, dayField, `${startHour}:${startMinute} - ${endHour}:${endMinute}`, [selectedWeek], '#ffffffff'])
        updateSchedule()
    }
}

function save ()
{
    localStorage.setItem('coursesSchedule', JSON.stringify(coursesSchedule))
    localStorage.setItem('examsSchedule', JSON.stringify(examsSchedule))
    localStorage.setItem('eventSchedule', JSON.stringify(eventSchedule))
}
handlingImport();
save();
updateSchedule();
