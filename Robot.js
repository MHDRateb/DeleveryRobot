function main(){
//_____________________________________________________________
//__________________Nodes______________________________________
var initalNode = createNode(loc, Sp,Lp, Ma, Mb);
var goalNode = createNode(Gloc, GSp,GLp,GMa, GMb);
var visitedList = [];
var solutionList = [];
var cost = 0;

function createNode(loc, sp, lp, ma, mb) {
    return {
        loc: loc,
        sp: sp,
        lp: lp,
        ma: ma,
        mb: mb,
        action: "start"
    }
}
//_____________________________________________________________
//__________________Actions____________________________________


function carrysmall(node) {
    var x = node.sp;
    if (x !== 0) {
        var node = createNode("A", x - 1, node.lp, node.ma, node.mb);
        node.action = "carry small package to A";
        var f = calculeF(node);
        node.f = f;
        return node
    }
    else {
        //return node;
        return goA(node);
    }
}

function carrylarg(node) {
    var x = node.lp;
    if (x !== 0) {
        var node = createNode("B", node.sp, x - 1, node.ma, node.mb);
        node.action = "carry larg package to B";
        var f = calculeF(node);
        node.f = f;
        return node
    }
    else {
        // return node
        return goB(node);
    }

}

function carrymedium(node) {
    if (node.loc === "A") {
        var x = node.ma;
        if (x !== 0) {
            var node = createNode("T", node.sp, node.lp, x - 1, node.mb);
            node.action = "carry medium pakage from A";
            var f = calculeF(node);
            node.f = f;
            return node
        }
        else {
            // return node
            return goT(node);
        }
    }
    if (node.loc === "B") {
        var x = node.mb;
        if (x !== 0) {
            var node = createNode("T", node.sp, node.lp, node.ma, x - 1);
            node.action = "carry medium pakage from B";
            var f = calculeF(node);
            node.f = f;
            return node
        }
        else {
            // return node
            return goT(node);
        }
    }
}

function goA(node) {
    var node = createNode("A", node.sp, node.lp, node.ma, node.mb);
    node.action = "GO to A";
    var f = calculeF(node);
    node.f = f;
    return node;
}

function goB(node) {
    var node = createNode("B", node.sp, node.lp, node.ma, node.mb);
    node.action = "GO to B";
    var f = calculeF(node);
    node.f = f;
    return node;
}

function goT(node) {
    var node = createNode("T", node.sp, node.lp, node.ma, node.mb);
    node.action = "GO to T";
    var f = calculeF(node);
    node.f = f;
    return node;
}

//_____________________________________________________________
//__________________expand_____________________________________
function expand(node) {
    var childs = [];
    cost = cost + 1;
    if (node.loc === "T") {
        childs.push(carrylarg(node));
        childs.push(carrysmall(node));
        node.childs = childs;
    }
    else {
        childs.push(carrymedium(node))
        node.childs = childs;
    }
}

//_____________________________________________________________
//__________________A*_________________________________________
function aStar(initalNode, goalNode) {
    var node = initalNode;
    while (!isequal(node, goalNode)) {
        visitedList.push(node);
        expand(node);
        node = chooseNode(node, visitedList);
    }
    visitedList.push(node);
    solutionList.push(node);
}


function chooseNode(node, visitedList) {
    if (node.childs.length !== 1) {
        var newNode;
        if ((node.childs[0].f <= node.childs[1].f) && (!isvisited(node.childs[0], visitedList))) {
            newNode = node.childs[0];
            solutionList.push(node)
            return newNode;
        }
        else if ((!isvisited(node.childs[1], visitedList))) {
            newNode = node.childs[1];
            solutionList.push(node)
            return newNode;
        }
    }
    else {

        if (!isvisited(node.childs[0], visitedList)) {
            solutionList.push(node)
            return node.childs[0];
        }

        else {
            return  visitedList[visitedList.length - 2].childs[1]
        }
    }
}

function calculeF(node) {
    var g = cost;
    // var h = hurstic(node);
    var h = hurstic2(node);
    var f = g + h;
    return f;

}

function hurstic(node) {
    var x = Math.abs(node.sp - goalNode.sp);
    var y = Math.abs(node.lp - goalNode.lp);
    var u = Math.abs(node.ma - goalNode.ma);
    var w = Math.abs(node.mb - goalNode.mb);
    var h = x + y + u + w;
    return h;
}

function hurstic2(node) {
    var x = Math.abs(node.sp - goalNode.sp);
    var y = Math.abs(node.lp - goalNode.lp);
    var u = Math.abs(node.ma - goalNode.ma);
    var w = Math.abs(node.mb - goalNode.mb);
    var h = Math.sqrt(x*x + y*y + u*u + w*w) ;
    return h;
}

function isequal(node1, node2) {
    if (node1.loc === node2.loc && node1.sp === node2.sp && node1.lp === node2.lp && node1.ma === node2.ma && node1.mb === node2.mb) {
        return true
    }

}
function isvisited(node, visitedList) {
        for (var i = 0; i < visitedList.length; i++) {
            if (isequal(node, visitedList[i])) {
                return true;
            }
            else {
                continue
            }
        }

}
//_____________________________________________________________
//__________________Display____________________________________


    console.log('Inital state  ', initalNode);
    console.log('Goal state  ', goalNode);
    console.log('        ');
    aStar(initalNode, goalNode);
    console.log('Visited List  ');    
    for (var i = 0; i < visitedList.length; i++) {
        console.log("(" + visitedList[i].loc, visitedList[i].sp, visitedList[i].lp, visitedList[i].ma, visitedList[i].mb + ")", visitedList[i].action);
    }
    console.log('        ');
    console.log('        ');
    console.log('Solution List  '); 
    for (var i = 0; i < solutionList.length; i++) {
        console.log("(" + solutionList[i].loc, solutionList[i].sp, solutionList[i].lp, solutionList[i].ma, solutionList[i].mb + ")", solutionList[i].action);
    }

}









