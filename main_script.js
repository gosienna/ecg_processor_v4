import {Plot2D} from './Plot2D.js'
//load BART output file example
fetch ("file_examples/BART_output.txt")
.then(x => x.text())
.then(function(y){
      ecg_data = extract_ecg(y,'BART_output.txt')
      init_ecg(ecg_data)
});


//canvas ID list  
let canvas_ID_list=['lead_V1','lead_V2','lead_V3','lead_V4','lead_V5','lead_V6','lead_I','lead_II','lead_III','lead_aVR','lead_aVL','lead_aVF']
//get ecg txt/csv file from input
let ecg_data = {}
canvas_ID_list.forEach(function(ID){
    ecg_data[ID] = []
})
//list of obj that holds all the canvas
let canvas_obj_list=[]
//parameter initialization
let x=100 
let click=false
// let seg_head = 0
// let seg_tail = 0
let file_name = ''
//array to collect segment information
let seg_info=[]
let seg_head=0
let seg_tail=0
let seg_count=0
//array to collect labling information
let IDs=[]
let lables=[]

//======================load CSV labling information=================================
document.getElementById('input_lable')
            .addEventListener('change', function() {  
            let fr=new FileReader()
            fr.readAsText(this.files[0])
            //file_name=this.files[0].name
            
            fr.onload=function(){
                read_lable(fr.result)
            }
        })
function read_lable(raw_lable){
    let lable_data=raw_lable.split('\r\n')
    lable_data.forEach(function(e){
        let single_lable = e.split(',')
        IDs.push(single_lable[0])
        lables.push(single_lable[1])
    }) 

}

//=====================load text file containing ecg infomation======================
document.getElementById('input_data')
            .addEventListener('change', function() {

            if (canvas_obj_list.length === 0){ //initialize the canvas
                console.log('1st')
                
                let fr=new FileReader()
                fr.readAsText(this.files[0])
                file_name=this.files[0].name
                fr.onload=function(){
                    ecg_data = extract_ecg(fr.result,file_name)
                    //console.log(ecg_data)
                    init_ecg(ecg_data)
                }

            }else{                            //redraw the canvas
                console.log('redraw')
                let fr=new FileReader()
                fr.readAsText(this.files[0])
                file_name=this.files[0].name
                fr.onload=function(){
                    //clean seg_info
                    seg_info=[]
                    //clean ecg_data
                    canvas_ID_list.forEach(function(ID){
                        ecg_data[ID] = []
                    })
                    ecg_data = extract_ecg(fr.result,file_name)
                    redraw_ecg(ecg_data)
                }
            } 
                
        })

function extract_ecg( raw_string , file_name ){
    let file_type = file_name.split('.').slice(-1)[0]
    
    if(file_type === 'txt'){
        let index_data=raw_string.indexOf('[Data]')
         //split the string and get rid of the last element, which is space
        let string_data = raw_string.slice(index_data+8).split('\n')
        string_data.pop()
        //console.log(string_data)
        string_data.forEach(function(one_row){
            let one_instance = one_row.split(',')
            canvas_ID_list.forEach(function(ID){
            switch (ID) {
                case 'lead_I':
                    ecg_data[ID].push(parseFloat(one_instance[0]))
                    break
                case 'lead_II':
                    ecg_data[ID].push(parseFloat(one_instance[1]))
                    break
                case 'lead_III':
                    ecg_data[ID].push(parseFloat(one_instance[2]))
                    break
                case 'lead_aVR':
                    ecg_data[ID].push(parseFloat(one_instance[3]))
                    break
                case 'lead_aVL':
                    ecg_data[ID].push(parseFloat(one_instance[4]))
                    break
                case 'lead_aVF':
                    ecg_data[ID].push(parseFloat(one_instance[5]))
                    break
                case 'lead_V1':
                    ecg_data[ID].push(parseFloat(one_instance[6]))
                    break
                case 'lead_V2':
                    ecg_data[ID].push(parseFloat(one_instance[7]))
                    break
                case 'lead_V3':
                    ecg_data[ID].push(parseFloat(one_instance[8]))
                    break
                case 'lead_V4':
                    ecg_data[ID].push(parseFloat(one_instance[9]))
                    break
                case 'lead_V5':
                    ecg_data[ID].push(parseFloat(one_instance[10]))
                    break
                case 'lead_V6':
                    ecg_data[ID].push(parseFloat(one_instance[11]))
                    break    
            }
            })
        })
        return ecg_data
    }else if(file_type === 'csv'){
        let string_data=raw_string.split('\r\n')
        string_data.shift()
        string_data.pop()
        //console.log(string_data)
        string_data.forEach(function(one_row){
            let one_instance = one_row.split(',')
            canvas_ID_list.forEach(function(ID){
                switch (ID) {
                    case 'lead_I':
                        ecg_data[ID].push(parseFloat(one_instance[3]))
                        break
                    case 'lead_II':
                        ecg_data[ID].push(parseFloat(one_instance[4]))
                        break
                    case 'lead_III':
                        ecg_data[ID].push(parseFloat(one_instance[5]))
                        break
                    case 'lead_aVR':
                        ecg_data[ID].push(parseFloat(one_instance[2]))
                        break
                    case 'lead_aVL':
                        ecg_data[ID].push(parseFloat(one_instance[1]))
                        break
                    case 'lead_aVF':
                        ecg_data[ID].push(parseFloat(one_instance[0]))
                        break
                    case 'lead_V1':
                        ecg_data[ID].push(parseFloat(one_instance[6]))
                        break
                    case 'lead_V2':
                        ecg_data[ID].push(parseFloat(one_instance[7]))
                        break
                    case 'lead_V3':
                        ecg_data[ID].push(parseFloat(one_instance[8]))
                        break
                    case 'lead_V4':
                        ecg_data[ID].push(parseFloat(one_instance[9]))
                        break
                    case 'lead_V5':
                        ecg_data[ID].push(parseFloat(one_instance[10]))
                        break
                    case 'lead_V6':
                        ecg_data[ID].push(parseFloat(one_instance[11]))
                        break    
                }
            })
        })
        return ecg_data
    }
    
}

//draw ecg wave from 12 leads over 12 canvas
function init_ecg(ecg_data){    
    let i = 0
    
    canvas_ID_list.forEach(function(id){
        //initialize plot
        let wave_type=document.getElementById('wave_type').value
        let Plot2D_obj = new Plot2D()
        Plot2D_obj.init(ecg_data[id],id)
        Plot2D_obj.add_vertical_marker(wave_type) // activate moving vertical marker 
        Plot2D_obj.add_triangle_marker(2000,wave_type)
        Plot2D_obj.add_grid() //show grid
        document.getElementById(id).addEventListener('mousemove',function(event){
            //console.log(event.clientX )
            let rect = this.getBoundingClientRect();
            x = (Plot2D_obj.camera.right-Plot2D_obj.camera.left)*((event.clientX-rect.left)/800) + Plot2D_obj.camera.left 
            updata_vertical_Marker(x)
            updata_triangle_Marker(x)
        })

        //click on canvas
        //--------------segment marking---------------------
        document.getElementById(id).addEventListener('click',function(event){
            click=!click
            //flip the click condition
            let rect = this.getBoundingClientRect();
            if(click === true){
                seg_head=parseInt((Plot2D_obj.camera.right-Plot2D_obj.camera.left)*((event.clientX-rect.left)/800) + Plot2D_obj.camera.left )
            }else{
                seg_tail=parseInt((Plot2D_obj.camera.right-Plot2D_obj.camera.left)*((event.clientX-rect.left)/800) + Plot2D_obj.camera.left )
                let wave_type=document.getElementById('wave_type').value
                seg_info.push([seg_head,seg_tail,wave_type,seg_count])
                seg_count+=1
                //console.log(wave_type)  
                //console.log(seg_info)
                canvas_obj_list.forEach(function(Plot2D_obj){
                    Plot2D_obj.addSeg(seg_head,seg_tail,wave_type)
                })
            }
        })
        canvas_obj_list.push(Plot2D_obj)  
    })
    
    function updata_vertical_Marker(x){
        //console.log(x)
        canvas_obj_list.forEach(function(Plot2D_obj){
            Plot2D_obj.vertical_marker.position.x = x
        })
    }
    
    function updata_triangle_Marker(x){
        let i=0
        let lead_ID
        canvas_obj_list.forEach(function(Plot2D_obj){
            // console.log(Plot2D_obj.triangle_marker)
            // console.log(ecg_data)
            Plot2D_obj.triangle_marker.position.x = x
            lead_ID = canvas_ID_list[i]
            Plot2D_obj.triangle_marker.position.y = ecg_data[lead_ID][Math.round(x)]
            i++
        })
    }
    //-----------add label for ECG----------------
    canvas_ID_list.forEach(function(ID){
        let target_canvas = document.getElementById(ID)
        //add lable
        let dom_lable = document.createElement('div')
        dom_lable.classList.add("lable_style")
        dom_lable.innerHTML=ID
        document.body.insertBefore(dom_lable,target_canvas)
    })
    
}

function redraw_ecg(ecg_data){
    
    canvas_obj_list.forEach(function(obj){
        let ecg = ecg_data[obj.canvasID]
        seg_count=0
        obj.clear_data()
        obj.ymax = Math.max(...ecg)
        obj.ymin = Math.min(...ecg)
        obj.xmin = 0
        obj.xmax = ecg.length
        obj.camera.left = obj.xmin
        obj.camera.right = obj.xmax
        obj.camera.top = obj.ymax
        obj.camera.bottom = obj.ymin
        obj.camera.updateProjectionMatrix()
        obj.draw_data(ecg)
        let wave_type=document.getElementById('wave_type').value
        obj.add_vertical_marker(wave_type) // activate moving vertical marker
        obj.add_triangle_marker(10000,wave_type)
        obj.add_grid() //show grid
    })

}
//==========================extend/shink ecg result========================
//let ecg can shrink and extend
document.getElementById("btn_extend").addEventListener('click',function(){
    //console.log("+")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.right = Plot2D_obj.camera.right*0.8
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})
document.getElementById("btn_shrink").addEventListener('click',function(){
    //console.log("-")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.right = Plot2D_obj.camera.right/0.8
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})
//=======================let ecg can move left or right==========================
document.getElementById("btn_left").addEventListener('click',function(){
    //console.log("+")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.left = Plot2D_obj.camera.left - 1000
        Plot2D_obj.camera.right = Plot2D_obj.camera.right- 1000
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})
document.getElementById("btn_left2").addEventListener('click',function(){
    //console.log("+")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.left = Plot2D_obj.camera.left - 2000
        Plot2D_obj.camera.right = Plot2D_obj.camera.right - 2000
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})

document.getElementById("btn_left3").addEventListener('click',function(){
    //console.log("+")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.left = Plot2D_obj.camera.left - 3000
        Plot2D_obj.camera.right = Plot2D_obj.camera.right - 3000
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})
document.getElementById("btn_right").addEventListener('click',function(){
    //console.log("-")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.left = Plot2D_obj.camera.left + 1000
        Plot2D_obj.camera.right = Plot2D_obj.camera.right + 1000
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})
document.getElementById("btn_right2").addEventListener('click',function(){
    //console.log("-")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.left = Plot2D_obj.camera.left + 2000
        Plot2D_obj.camera.right = Plot2D_obj.camera.right + 2000
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})
document.getElementById("btn_right3").addEventListener('click',function(){
    //console.log("-")
    canvas_obj_list.forEach(function(Plot2D_obj){
        Plot2D_obj.camera.left = Plot2D_obj.camera.left + 3000
        Plot2D_obj.camera.right = Plot2D_obj.camera.right + 3000
        Plot2D_obj.camera.updateProjectionMatrix ()
    })
})
//==========================add 'save result' =============================
document.getElementById('save').addEventListener('click',function(){
    
    let file_type = file_name.split('.').slice(-1)[0]
    let ID = ''
    if(file_type === 'txt'){
        ID = file_name.split(' ')[0]
    }else if(file_type === 'csv'){
        ID = file_name.split('.')[0]
        
    }
    

    let index_lable = IDs.indexOf(ID)
    let location = lables[index_lable]
    //console.log(ID,location)
    //initialize header of the .csv file
    let result = 'I,II,III,aVR,aVL,aVF,V1,V2,V3,V4,V5,V6,ID,peak_type,seg_id,location\n'
    //save all segment result into one .csv file
    console.log(seg_info)
    let peak_type='null'
    let head=0
    let tail=0
    let seg_id=0
    for(let t = 0; t < ecg_data.lead_I.length; t++){ //t here represent one time step
        canvas_ID_list.forEach(function(ID){
            result += ecg_data[ID][t] 
            result += ","
        })
        //screen through collected segment information
        for(let i = 0; i<seg_info.length;i++){ // i here represent one segment being captured
            
            head = seg_info[i][0]
            tail = seg_info[i][1]
            if( t >= head && t<=tail){  // if this time step is within a segment then mark the peak type information
                peak_type = seg_info[i][2]
                seg_id = seg_info[i][3]
                break
            }else{
                peak_type = 'null'
                seg_id = 'null'
            }
            

        }
        
        result += ID
        result += ','
        result += peak_type
        result += ','
        result += seg_id
        result += ','
        result += location
        result += '\r\n'
        
    } 

    //download file
    let hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);  
    hiddenElement.target = '_blank';     
    //provide the name for the CSV file to be downloaded  
    let save_name = ID
    hiddenElement.download = save_name;  
    hiddenElement.click();
    hiddenElement.remove();  
})

