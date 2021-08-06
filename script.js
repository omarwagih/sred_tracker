
Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};


Date.prototype.getMonday = function(){
    var d = new Date(this);
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    m = new Date(d.setDate(diff))
    m.setHours(0,0,0,0);
    return m;
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.formatAMPM = function() {
    var date = new Date(this);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + '' + ampm;
    return strTime;
}

Date.prototype.format2 = function(){
    var d = new Date(this);
    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(d);
    return `${da} ${mo} ${ye}, ${d.formatAMPM()}`;
}

Array.prototype.unique = function(){
    var a = this; 
    uniq = a.filter(function(item, pos) {
        return a.indexOf(item) == pos;
    })
    return uniq;
}


// For a event starting and ending at e_start and e_end find how many milliseconds fall within week_start - week_end
var overlapWithWeek = function(
    e_start, e_end, 
    week_start, week_end){

    if(e_end < e_start) throw 'End date of event must be larger than start date'
    if(week_end < week_start) throw 'End date of week must be larger than start date'
    
    // Duration of event
    event_duration = e_end - e_start;

    // Event ends before week, disregard
    if(e_end < week_start || e_start >= week_end) return 0;

    // Event ends within the week
    // s  |  e      |
    //    |  s  e   |
    if(e_end >= week_start & e_end < week_end){
        // Event contained within week
        if(e_start >= week_start) return event_duration;
        // Return portion contained within week
        return e_end - week_start;
    }

    //    |  s      | e
    //    |  s  e   |
    if(e_start >= week_start & e_start < week_end){
        // Event contained within week
        if(e_end <= week_end) return event_duration;
        // Return portion contained within week
        return week_end - e_start;
    }
    
}


var curr = new Date(); // get current date
var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
var last = first + 6; // last day is the first day + 6

var firstday = new Date(curr.setDate(first));
var lastday = new Date(curr.setDate(last));


function timeDiff(curr, prev) { 
    var ms_Min = 60 * 1000; // milliseconds in Minute 
    var ms_Hour = ms_Min * 60; // milliseconds in Hour 
    var ms_Day = ms_Hour * 24; // milliseconds in day 
    var ms_Mon = ms_Day * 30; // milliseconds in Month 
    var ms_Yr = ms_Day * 365; // milliseconds in Year 
    var diff = curr - prev; //difference between dates. 
    // If the diff is less then milliseconds in a minute 
    if (diff < ms_Min) { 
        tmp = Math.round(diff / 1000)
        return tmp + (tmp == 1? ' second' : ' seconds'); 
        // If the diff is less then milliseconds in a Hour 
    } else if (diff < ms_Hour) { 
        tmp = Math.round(diff / ms_Min); 
        return tmp + (tmp == 1? ' minute' : ' minutes'); 
        // If the diff is less then milliseconds in a day 
    } else if (diff < ms_Day) { 
        tmp = Math.round(diff / ms_Hour); 
        return tmp + (tmp == 1? ' hour' : ' hours'); 
        // If the diff is less then milliseconds in a Month 
    } else if (diff < ms_Mon) { 
        tmp = Math.round(diff / ms_Day); 
        return 'Around ' + tmp +  (tmp == 1? ' day' : ' days'); 
        // If the diff is less then milliseconds in a year 
    } else if (diff < ms_Yr) { 
        tmp = Math.round(diff / ms_Mon);
        return 'Around ' + tmp +  (tmp == 1? ' month' : ' months'); 
    } else { 
        tmp = Math.round(diff / ms_Yr);
        return 'Around ' + tmp +  (tmp == 1? ' year' : ' years');
    } 
} 




var SRED_PROJECTS = 'SRED_PROJECTS'
//localStorage.setItem(SRED_PROJECTS, '{}');

const demo_data = [
    {
        name: 'Screening drugs', 
        description: 'Transfection of plates, data analysis, making my bed, drinking diet coke', 
        show_details: true,
        events:[
            {start_time: new Date(2021, 0, 8, 9), end_time: new Date(2021, 0, 8, 13)},
            {start_time: new Date(2021, 0, 8, 13), end_time: new Date(2021, 0, 10, 13)},
            {start_time: new Date(2021, 0, 10, 13), end_time: new Date(2021, 0, 11, 13)}
        ]
    }, 

    {
        name: 'Doing cool science', 
        description: 'Testing out the coolest science, working with folks, buying a dog, drinking diet coke', 
        show_details: true,
        events:[
            {start_time: new Date(2021, 0, 2, 8), end_time: new Date(2021, 0, 2, 13)},
            {start_time: new Date(2021, 0, 2, 14), end_time: new Date(2021, 0, 5, 14)},
            {start_time: new Date(2021, 0, 7, 9), end_time: new Date(2021, 0, 9, 11)}
        ]
    }

]




get_local = function(){
    var obj = localStorage.getItem(SRED_PROJECTS)
    if(!obj) return [];
    return JSON.parse(obj);
}

set_local = function(obj){
    localStorage.setItem(SRED_PROJECTS, JSON.stringify(obj));
}

if(false){
    window.SRED_PROJECTS = 'SRED_PROJECTS'
    obj = demo_data;
    set_local(obj);
}

var obj = localStorage.getItem(SRED_PROJECTS)
if(!obj) set_local(demo_data)


add_project = function(name, description){
    
    var obj = get_local()
    var tmp = {
        'name' : name,
        'description': description,
        'is_active' : false,
        'events': []
    }
    obj.push(tmp)

    set_local(obj)
    visualize_projects();
}

remove_project = function(index){
    var obj = get_local()
    if(obj.length == 0) return;
    obj.splice(index, 1);
    localStorage.setItem(SRED_PROJECTS, JSON.stringify(obj));
    visualize_projects();
}

remove_event = function(project_index, event_index){
    var obj = get_local()
    if(obj.length == 0) return;

    e = obj[project_index].events[event_index];
    if(e.end_time == null){
        alert('In-progress events cannot be removed. Stop the project and try again.');
        return;
    }

    obj[project_index].events.splice(event_index, 1)
    localStorage.setItem(SRED_PROJECTS, JSON.stringify(obj));
    visualize_projects();
}

visualize_projects = function(){
    var obj = get_local();
    $('#projects').empty();
    for(var i=0; i<obj.length; i++){
        var p = obj[i];


        // List of events
        var rows = [];
        for(var j=0; j<p.events.length; j++){
            var e = p.events[j];
            var start_time = new Date(e.start_time);
            var start_time_str = start_time.format2();
            var end_time = new Date(e.end_time);
            var end_time_str = e.end_time == null ? '' : end_time.format2();
            var diff_str = e.end_time == null ? '<span class="elapsed"></span>' : timeDiff(end_time, start_time);

            var edit_btn = e.end_time == null ? '' : '<button class="btn btn-sm update-event"><i class="fas fa-edit"></i></button>'
            var edit_btn = '';
            var row = `<tr class="sred-event" index="${j}">
                <td><button class="btn btn-sm remove-event"><i class="fas fa-trash"></i></button>
                ${edit_btn}
                </td>
                <td>${start_time_str}</td>
                <td>${end_time_str}</td>
                <td>${diff_str}</td>
             </tr>`
            rows.push(row);
        }

        events_html_str = `<hr/>
        <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Start</th>
            <th scope="col">End</th>
            <th scope="col">Time spent on project</th>
          </tr>
        </thead>
        <tbody>
            ${rows.join('')}
          </tr>
        </tbody>
      </table>`
        
        if(rows.length == 0) events_html_str = '<hr/><h6>No times recorded for this project.</h6>'

        var html = `
        <a href="#" class="list-group-item list-group-item-action flex-column align-items-start sred-project" id="sred-project-${i}" index=${i}>
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${p.name}</h5>
            <div class="float-right">
                <button class="btn btn-sm remove-project"><i class="fas fa-trash"></i></button>
                <button type="button" class="toggle-details btn btn-sm"><i class="fas fa-list" style="margin-right:6px"></i></button>
                <button type="button" class="start-project btn btn-secondary btn-sm" style="${p.is_active?'display:none': ''}"><i class="fas fa-play"></i> Start project</button>
                <button type="button" class="stop-project btn btn-danger btn-sm" style="${!p.is_active?'display:none': ''}"><i class="fas fa-stop"></i> Stop project</button>
            </div>
          </div>
          <p class="mb-1">${p.description}</p>
        
          <p class="text-success lead curr-working" style="${!p.is_active?'display:none': ''}">Currently working on this project
          (<span class="elapsed" style="${!p.is_active?'display:none': ''}"></span>)
          </p>

          <div class="details" style="${!p.show_details ? 'display:none' : ''}">
          ${events_html_str}
          </div>
        </a>`
        $('#projects').append($(html))
    }


    $('.start-project').click(function(){
        var index = $(this).closest('.sred-project').attr('index');
        console.log('index is:' + index)
        start_project(index)
    })

    $('.stop-project').click(function(){
        var index = $(this).closest('.sred-project').attr('index');
        console.log('index is:' + index)
        stop_project(index)
    });

    $('.toggle-details').click(function(){
        var sred_proj = $(this).closest('.sred-project')
        var index = sred_proj.attr('index');
        toggle_details(index, sred_proj);
    })

    $('.remove-project').click(function(){

        if(confirm('Are you sure you want to delete this project? This cannot be undone.')){
            var index = $(this).closest('.sred-project').attr('index');
            remove_project(index);
        }
        
    });

    $('.remove-event').click(function(){
        if(confirm('Are you sure you want to delete this event? This cannot be undone.')){
            var project_index = $(this).closest('.sred-project').attr('index');
            var event_index = $(this).closest('.sred-event').attr('index');
            remove_event(project_index, event_index)
        }
    });


    update_elapsed();
}

toggle_details = function(index, elem){
    var obj = get_local();
    elem.find('.details').slideToggle();
    if(obj[index].show_details){
        obj[index].show_details = false;
    }else{
        obj[index].show_details = true
    }
    set_local(obj)
}

stop_project = function(index){
    var obj = get_local()
    obj[index].is_active = false
    
    var e = obj[index].events
    e.slice(-1)[0].end_time = new Date();

    set_local(obj)
    visualize_projects();
}


start_project = function(index){
    var obj = get_local()
    obj[index].is_active = true

    var e = obj[index].events
    e.push({
        'start_time' : new Date(),
        'end_time': null
    })

    set_local(obj)
    visualize_projects();
}


clear_all_events = function(){
    var obj = get_local()
    for(var i = 0; i<obj.length; i++){
        obj[i].events = []
        obj[i].is_active = false
    }
    set_local(obj)
    visualize_projects()
}

update_elapsed = function(){
    curr_time = new Date()
    var obj = get_local()
    for(var i = 0; i<obj.length; i++){
        var e = obj[i].events;
        if(e.length == 0) continue;
        var latest_event = e.slice(-1)[0];
        if(latest_event.end_time != null) continue;

        diff = timeDiff(curr_time, new Date(latest_event.start_time))
        $('#sred-project-' + i).find('.elapsed').text(diff + ' elapsed').show();
    }
}


// Returns list of week start dates (Monday, midnight) for events 
listEventWeeks = function(){
    // Get object
    var obj = get_local()
    weeks = []

    // For each object 
    for(var i = 0; i < obj.length; i++){

        // For each event
        for(var j = 0; j < obj[i].events.length; j++){

            // Get event 
            var e = obj[i].events[j];

            // Push Monday of start and end time (if exists)
            weeks.push( new Date(e.start_time).getMonday().toLocaleString() )
            if(e.end_time != null) weeks.push( new Date(e.end_time).getMonday().toLocaleString() );
        }
    }

    // Deduplicate weeks and return as array of dates
    weeks = weeks.unique().sort().reverse();
    weeks = weeks.map(function(x){ return new Date(x)})

    return weeks;
}

// Generates a SRED report string
generateSredReport = function(){

    // Get object
    var obj = get_local()

    var sred_report = [];

    // Get weeks
    weeks = listEventWeeks();

    // For each week 
    for(var w = 0; w < weeks.length; w++){

        // Compute end date of week (+7 days)
        var week_start = weeks[w];
        var week_end = week_start.addDays(7);
        

        var time_spent = [];
        // For each project 
        for(var i = 0; i < obj.length; i++){

            var proj = obj[i];

            // Total time spent for this project during this week 
            var t = 0;
            for(var j = 0; j < proj.events.length; j++){

                // Events j for this project 
                var e = proj.events[j];

                // Convert to Dates and if project is still in progress use current date
                e.start_time = new Date(e.start_time)
                if(e.end_time == null){
                    e.end_time = new Date();
                }else{
                    e.end_time = new Date(e.end_time);
                }
                
                // Compute how much of this event falls in this week
                var overlap = overlapWithWeek(e.start_time, e.end_time, week_start, week_end);
                t += overlap;
            }
            console.log('Time spent on ' + obj[i].name + ' = ' + t);
            time_spent.push({'title': obj[i].name + ' - ' + obj[i].description, 't':t})
        }

        // Compute total time spent working on projects this week
        total_time = time_spent.map(function(x){ return x.t}).reduce((a, b) => a + b, 0)

        // Initialize SRED report for this week
        var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(week_start);
        var mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(week_start);
        var da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(week_start);
        //console.log();
        var sred_i = [`Week starting ${mo} ${da}, ${ye}`];
        console.log(sred_i)
        // Compute each line of the sred report 
        for(var i = 0; i < time_spent.length; i++){
            var perc_work = Math.round( time_spent[i].t / total_time * 100 );
            // Only report things we spent minimum 1% on
            if(perc_work >= 1) sred_i.push(`- ${perc_work}% on ${time_spent[i].title}`)
        }
        sred_report.push(sred_i.join('\n'))
    }
    sred_report = sred_report.join('\n\n')

    return sred_report;
}



$(document).ready(function(){
    visualize_projects();
 
    var intervalId = window.setInterval(update_elapsed, 1000);
 
    $('#add-project').click(function(){
        var pn = $('#project-name').val()
        var pd = $('#project-description').val();
        if(!pn || !pd){
            alert('You must enter a project name and description')
            return;
        }
        add_project(pn, pd);
        $('#close-add-project').click()
    });
 
    $('#email-sred').click(function(){
        console.log('click')
        var s = generateSredReport().replace(/(?:\r\n|\r|\n)/g, '%0D%0A');
        window.location.href = "mailto:?subject=My SRED report&body=" + s;
    });
 
 });

// var week_start = new Date(2021, 1, 8, 00);
// var week_end = week_start.addDays(7);
// var week_diff = week_end - week_start

// e_start = new Date(2021, 1, 8, 00)
// e_end = new Date(2021, 1, 15, 00)

// var d = overlapWithWeek(e_start, e_end, week_start, week_end);
// console.log(d)
// console.log(d/week_diff)