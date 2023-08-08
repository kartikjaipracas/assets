function render(template, host, data, callback = null){

    let templateBody = document.querySelector('#' + template);
    
    let clone = templateBody.content.cloneNode(true);

    let nodeList = clone.querySelectorAll('*');

    for(let node of nodeList){


        if(callback != null){
            if(callback.before){
                callback.before(node);
            }else{
                callback(node);
            }
        }
        
        let attributes = node.attributes;

        for(let attribute of attributes){
            if(data.hasOwnProperty(attribute.nodeValue)){

                switch(attribute.nodeName){
                    case 'data-src':
                        node.src = data[attribute.nodeValue];
                        break;
                    case 'data-name':
                        node.innerHTML = data[attribute.nodeValue];
                        break;
                    case 'data-class':
                        node.classList.add(data[attribute.nodeValue]);
                        break;
                    case 'id':
                        node.setAttribute('id', data[attribute.nodeValue]);
                        break;
                    case 'value':
                        node.value = data[attribute.nodeValue];
                        break;
                    default:
                        if(attribute.nodeName.substring(0,5) == 'data-'){
                            attribute.nodeValue = data[attribute.nodeValue];
                        }
                }
            }
        }

        if(callback != null){
            if(callback.after){
                callback.after(node);
            }
        }
    }

    if(typeof host == 'string'){
        document.querySelector('#' + host).appendChild(clone);
    }else{
        host.appendChild(clone);
    }
}

function template(tpl, host){
    return new TemplateEngine(tpl, host);
}

class TemplateEngine{
    constructor(tpl, host){
        this.tpl = tpl;
        this.host = host;
        this.callbackFunc = null;
    }

    clear(){
        document.querySelector('#' + this.host).innerHTML = '';
        return this;
    }

    loading(tpl){

        this.clear();
        let templateBody = document.querySelector('#' + tpl);
        let clone = templateBody.content.cloneNode(true);
        document.querySelector('#' + this.host).append(clone);

        return this;
    }

    hostClass(strClassList, add = true){
        let array = strClassList.split(' ');
        let classList = document.querySelector('#' + this.host).classList;

        for(let className of array){
            if(add){
                classList.add(className);
            }else{
                classList.remove(className);
            }
        }
        return this;
    }

    callback(callback){
        this.callbackFunc = callback;
        return this;
    }

    renderArray(data){
        for(let item of data){
            this.render(item);
        }
    }

    render(data = {}){

        let templateBody = document.querySelector('#' + this.tpl);
        
        let clone = templateBody.content.cloneNode(true);

        let nodeList = clone.querySelectorAll('*');

        let capturedNodes = {};

        for(let node of nodeList){

            let attributes = node.attributes;

            for(let attribute of attributes){

                if(data.hasOwnProperty(attribute.nodeValue)){

                    switch(attribute.nodeName){
                        case 'data-src':
                            node.src = data[attribute.nodeValue];
                            node.removeAttribute("data-src");
                            break;
                        case 'data-name':
                            node.innerHTML = data[attribute.nodeValue];
                            node.removeAttribute("data-name");
                            break;
                        case 'data-class':
                            node.classList.add(data[attribute.nodeValue]);
                            node.removeAttribute("data-class");
                            break;
                        case 'id':
                            node.setAttribute('id', data[attribute.nodeValue]);
                            break;
                        case 'value':
                            node.value = data[attribute.nodeValue];
                            break;
                        default:
                            if(attribute.nodeName.substring(0,5) == 'data-'){
                                attribute.nodeValue = data[attribute.nodeValue];
                            }
                    }
                }
            }
            
            let tag = attributes.getNamedItem("data-tag");

            if(tag){
                capturedNodes[tag.value] = node;
            }

            node.removeAttribute("data-tag");
        }

        if(this.callbackFunc){
            this.callbackFunc(capturedNodes, data);
        }

        if(typeof this.host == 'string'){
            if(document.querySelector('#' + this.host)){
                document.querySelector('#' + this.host).appendChild(clone);
            }else{
                throw new Error(`Template host not found [${this.host}]`);
            }
            
        }else{
            this.host.appendChild(clone);
        }
    }
}

class Request{

    static async post(url, params = {}){

        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(params)
        });

        return response;
    }
}
