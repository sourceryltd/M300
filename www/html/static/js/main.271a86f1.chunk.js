(this.webpackJsonpprinter=this.webpackJsonpprinter||[]).push([[0],{103:function(e,t,a){e.exports=a(133)},108:function(e,t,a){},115:function(e,t,a){},116:function(e,t,a){},121:function(e,t,a){},122:function(e,t,a){},123:function(e,t,a){},124:function(e,t,a){},125:function(e,t,a){},126:function(e,t,a){},133:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(12),l=a.n(c),o=(a(108),a(48)),i=a(7),s=a(201),u=a(183),m=a(181),d=a(71),p=a(136),f=a(207),E=a(169),h=a(171),b=a(173),g=a(174),v=Object(E.a)({card:{margin:"32px",border:"2px solid rgba(0, 0, 0, 0.12)",textAlign:"center"}}),y=function(e){var t=e.title,a=e.description,n=e.onClick,c=v();return r.a.createElement(h.a,{onClick:n,className:c.card},r.a.createElement(b.a,null,r.a.createElement(g.a,null,r.a.createElement(d.a,{variant:"h2"},t),r.a.createElement("p",null,a))))},O=function(e,t){return console.log(e),console.log(t),localStorage.setItem(e,t)},j=function(e){return localStorage.getItem(e)},k=Object(E.a)({header:{textAlign:"center",fontSize:"32px"}}),C=function(e){var t=e.setStep,a=k(),n=function(e){O("printerProfile",e),t(1)};return r.a.createElement("div",null,r.a.createElement("h2",{className:a.header},"Where will this printer be used?"),r.a.createElement(y,{title:"Home",onClick:function(){return n("Home")}}),r.a.createElement(y,{title:"Classroom",onClick:function(){return n("Classroom")}}))},S=a(182),x=a(18),w=a.n(x),N=a(27),M=function(e){return Object(n.useEffect)(e,[])},T=a(135),P=a(175),z=a(206),G=a(176),I=a(177),B=a(178),A=a(202),D=a(209),F=a(180),Z=a(44),L=a.n(Z),W=a(89),J=a.n(W),U=(a(113),Object(E.a)({accordion:{display:"flex",justifyContent:"center"},backdrop:{zIndex:1e4,color:"#fff"},button:{alignSelf:"flex-end",height:"36px",marginLeft:"25px"},connecting:{display:"flex",flexDirection:"column",alignItems:"center","& h4":{marginBottom:"24px"}},container:{display:"flex",flexDirection:"column"},header:{display:"flex",alignItems:"center"},item:{padding:"30px 15px",fontSize:"24px",display:"flex",justifyContent:"space-between"},keyboard:{position:"fixed",bottom:0,left:0,right:0,color:"#000"}})),Y=function(e){var t=e.setStep,a=e.setShowSnack,c=e.setSnackMessage,l=(e.handleSnackClose,e.setConnectWifi),o=U(),s=Object(n.useState)(!1),u=Object(i.a)(s,2),m=u[0],d=u[1],f=Object(n.useState)("default"),E=Object(i.a)(f,2),h=E[0],b=E[1],g=Object(n.useState)(""),v=Object(i.a)(g,2),y=v[0],O=v[1],j=Object(n.useState)([]),k=Object(i.a)(j,2),C=k[0],S=k[1],x=Object(n.useState)(!1),Z=Object(i.a)(x,2),W=Z[0],Y=Z[1],R=Object(n.useRef)();M((function(){function e(){return(e=Object(N.a)(w.a.mark((function e(){var t;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("http://makerhub.local:8990/networks/scan");case 2:return t=e.sent,e.abrupt("return",t.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(function(){return e.apply(this,arguments)})().then((function(e){var t=e.networks.filter((function(e,t,a){return a.map((function(e){return e.ssid})).indexOf(e.ssid)===t&&null!=e.ssid}));S(t)}))}));var H=function(){var e=Object(N.a)(w.a.mark((function e(){var n,r,l;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:l=function(){return(l=Object(N.a)(w.a.mark((function e(t){var a;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(t),e.next=3,fetch("http://makerhub.local:8990/connect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 3:return a=e.sent,e.abrupt("return",a.json());case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)},r=function(e){return l.apply(this,arguments)},n={ssid:m,password:y},d(!1),Y(!0),O(""),r(n).then((function(e){Y(!1),"connected!"==e.status?(c("Successfully Connected"),t(2)):c("Connection Failed"),a((function(){return!0}))}));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),X=function(e){var t=e.target.value;O(t),R.current.setInput(t)};return r.a.createElement("div",{className:o.container},r.a.createElement("div",{className:o.header},r.a.createElement(T.a,{"aria-label":"back",onClick:function(){return l((function(){return null}))}},r.a.createElement(L.a,null)),r.a.createElement("h2",null,"Wi-Fi")),r.a.createElement(P.a,null,C.map((function(e){return r.a.createElement(z.a,{expanded:m===e.ssid,key:"".concat(e.ssid,"-list-item")},r.a.createElement(G.a,{classes:{content:"accordion-style"}},r.a.createElement(I.a,{className:o.item},e.ssid,r.a.createElement(p.a,{color:m===e.ssid?"secondary":"primary",variant:"contained",onClick:function(){var t;m===e.ssid?(d((function(){return!1})),O("")):(t=e.ssid,d(t))}},m===e.ssid?"Close":"Join"))),r.a.createElement(B.a,{className:o.accordion},r.a.createElement(A.a,{id:"standard-password-input",label:"Password",type:"password",color:"secondary",value:y,onChange:X}),r.a.createElement(p.a,{color:"primary",variant:"contained",className:o.button,onClick:function(){y.length>0?H():(c("Password required"),a(!0))}},"Connect")))}))),W&&r.a.createElement(D.a,{className:o.backdrop,open:W},r.a.createElement("div",{className:o.connecting},r.a.createElement("h4",null,"Connecting"),r.a.createElement(F.a,{color:"inherit"}))),m&&r.a.createElement("div",{className:o.keyboard},r.a.createElement(J.a,{keyboardRef:function(e){return R.current=e},layoutName:h,onChange:function(e){O(e),console.log("Input changed",e)},onKeyPress:function(e){("{shift}"===e||"{lock}"===e)&&b("default"===h?"shift":"default"),"{enter}"===e&&H()}})))},R=Object(E.a)({buttonContainer:{display:"flex",width:"100%",justifyContent:"space-around",marginTop:"56px"},container:{padding:"32px",textAlign:"center","& p":{fontSize:"2.125rem"}}}),H=function(e){var t=e.setStep,a=e.setConnectWifi,n=e.type,c=R();return r.a.createElement(m.a,{container:!0,item:!0,spacing:6,direction:"column",alignItems:"center",className:c.container},r.a.createElement("h2",null,"Your SSID is",r.a.createElement(d.a,{color:"secondary",variant:"body1"},"Maker300X")),r.a.createElement("h2",null,"Your password is",r.a.createElement(d.a,{color:"secondary",variant:"body1"},"makermade")),"ethernet"===n&&r.a.createElement(m.a,{item:!0},r.a.createElement(d.a,{variant:"h4"},"Please connect your cable")),r.a.createElement(m.a,{item:!0,className:c.buttonContainer},r.a.createElement(p.a,{color:"secondary",variant:"contained",onClick:function(){return a(null)}},"Back"),r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){return t(2)}},"Next")))},X=Object(E.a)({header:{display:"flex","& h2":{fontSize:"28px"}}}),$=function(e){var t=e.setStep,a=e.setSnackMessage,c=e.setShowSnack,l=e.handleSnackClose,o=X(),s=Object(n.useState)(null),u=Object(i.a)(s,2),d=u[0],f=u[1],E=function(e){O("networkProfile",e),f(e)};return r.a.createElement(r.a.Fragment,null,null===d?r.a.createElement(r.a.Fragment,null,r.a.createElement(m.a,{container:!0,justify:"space-between",alignItems:"center",className:o.header},r.a.createElement("h2",null,"Network"),r.a.createElement(p.a,{"aria-label":"skip",endIcon:r.a.createElement(S.a,null),onClick:function(){var e;e="networkProfile",localStorage.removeItem(e),t(2)}},"Skip")),r.a.createElement(y,{title:"Wi-Fi",onClick:function(){return E("wifi")}}),r.a.createElement(y,{title:"Hotspot",onClick:function(){return E("hotspot")}}),r.a.createElement(y,{title:"Ethernet",onClick:function(){return E("ethernet")}})):"wifi"===d?r.a.createElement(Y,{setStep:t,setShowSnack:c,setSnackMessage:a,handleSnackClose:l,setConnectWifi:f}):r.a.createElement(H,{setStep:t,setConnectWifi:f,type:d}))},q=(a(115),function(e){var t=e.handleOnboarding,a=e.setStep,n=function(){var e=Object(N.a)(w.a.mark((function e(n){var r;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j("networkProfile");case 2:r=e.sent,O("userMode",n),O("onboarded",!0),"wifi"===r||"ethernet"===r?a(3):t(n);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement("div",{className:"menu-container"},r.a.createElement("h3",null,"Please choose a mode"),r.a.createElement("div",{className:"menu-options-container"},r.a.createElement(y,{title:"Beginner",description:"For beginners. We will walk you through how to operate your 3D printer, step by step.",onClick:function(){return n(0)}}),r.a.createElement(y,{title:"Standard",description:"For users familiar with 3D printing.",onClick:function(){return n(1)}}),r.a.createElement(y,{title:"Advanced",description:"For advanced users, unlocks features to customize your printer firmware any way you like!",onClick:function(){return n(2)}})))}),K=Object(E.a)({checker:{flex:2,"& button":{width:"200px",height:"50px",fontSize:"14px"}},updateContainer:{flex:3,"& h3":{fontSize:"28px",textAlign:"center"}}}),V=function(e){var t=e.autoCheck,a=e.handleOnboarding,c=K(),l=Object(n.useState)(!1),o=Object(i.a)(l,2),s=o[0],u=o[1],f=Object(n.useState)("Update device"),E=Object(i.a)(f,2),h=E[0],b=E[1],g=Object(n.useState)(!1),v=Object(i.a)(g,2),y=v[0],O=v[1],k=Object(n.useState)(!1),C=Object(i.a)(k,2),x=C[0],w=C[1];M((function(){t&&N()}));var N=function(){b("Checking for updates..."),u(!0),setTimeout((function(){u(!1),b("Updates available!"),O(!0)}),3e3)};return r.a.createElement(m.a,{container:!0,direction:"column",alignItems:"center",style:{height:"100%"}},t&&!x&&r.a.createElement(p.a,{style:{alignSelf:"flex-end",marginTop:"15px"},"aria-label":"skip",endIcon:r.a.createElement(S.a,null),onClick:function(){var e=j("userMode");a(e)}},"Skip"),r.a.createElement(m.a,{container:!0,direction:"column",justify:"center",alignItems:"center",className:c.updateContainer},s&&r.a.createElement(F.a,{color:"secondary"}),h.length>0&&r.a.createElement(d.a,{variant:"h3"},h),y&&r.a.createElement(p.a,{variant:"contained",color:"secondary",onClick:function(){u(!0),b("Downloading, please wait..."),O(!1),setTimeout((function(){u(!1),b("Update successful, please reboot the printer."),w(!0)}),3e3)},style:{marginTop:"24px"}},"Download Update")),r.a.createElement(m.a,{container:!0,justify:"center",alignItems:"center",className:c.checker},!y&&!s&&r.a.createElement(p.a,{variant:"contained",disabled:s||x,onClick:N},"Check for updates")))},Q=Object(E.a)({container:{flex:1,display:"flex",flexDirection:"column"},welcome:{textAlign:"center",height:"100%","& h2":{fontSize:"92px"},"& h3":{fontSize:"32px",marginTop:"16px"}}}),_=function(e){var t=e.handleOnboarding,a=Q(),c=Object(n.useState)(null),l=Object(i.a)(c,2),o=l[0],s=l[1],E=Object(n.useState)(!1),h=Object(i.a)(E,2),b=h[0],g=h[1],v=Object(n.useState)(""),y=Object(i.a)(v,2),O=y[0],j=y[1],k=function(){g((function(){return!1})),j("")};return r.a.createElement(u.a,{className:a.container},null===o&&r.a.createElement(m.a,{container:!0,direction:"column",justify:"space-around",alignItems:"center",spacing:3,className:a.welcome},r.a.createElement(m.a,{item:!0,container:!0,direction:"column",justify:"center",alignItems:"center",style:{flex:1}},r.a.createElement(d.a,{variant:"h2"},"Welcome"),r.a.createElement(d.a,{variant:"h3"},"Let's get you set up")),r.a.createElement(m.a,{item:!0,container:!0,alignItems:"flex-start",justify:"center",style:{flex:1}},r.a.createElement(p.a,{variant:"contained",size:"large",color:"secondary",style:{width:"190px",height:"65px",fontSize:"18px"},onClick:function(){return s(0)}},"Get Started"))),0===o&&r.a.createElement(C,{setStep:s}),1===o&&r.a.createElement($,{setStep:s,setShowSnack:g,setSnackMessage:j,handleSnackClose:k}),2===o&&r.a.createElement(q,{handleOnboarding:t,setStep:s}),3===o&&r.a.createElement(V,{autoCheck:!0,handleOnboarding:t}),r.a.createElement(f.a,{open:b,autoHideDuration:6e3,message:O,onClose:k}))},ee=a(199),te=a(204),ae=a(184),ne=(a(116),function(e){var t=e.tabList,a=e.handleTabClick,n=e.activeTab,c=e.disabledNav;return r.a.createElement(te.a,{value:n,onChange:a,centered:!0},t.map((function(e){return r.a.createElement(ae.a,{style:{height:"70px",fontSize:"20px",minWidth:"140px"},label:e,key:"tab - ".concat(e),disabled:c})})))}),re=a(92),ce=a(185),le=a(39),oe=a(55),ie=Object(E.a)({buttonContainer:{display:"flex",justifyContent:"center",marginTop:"10px"},textCenter:{textAlign:"center",marginTop:"10px"}}),se=function(e){e.lastMessage;var t=e.progressState,a=(e.setDisabledNav,e.state),c=(ie(),Object(n.useState)(!1)),l=Object(i.a)(c,2),o=l[0],s=l[1],m=Object(n.useState)(0),d=Object(i.a)(m,2),f=d[0],E=d[1];return Object(n.useEffect)((function(){t.completion!==f&&(E(t.completion),console.log(f))}),[t]),r.a.createElement(r.a.Fragment,null,r.a.createElement(u.a,null,r.a.createElement("div",{className:"print-btn-container"},r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){s((function(e){return!e})),fetch("http://makerhub.local:8080/api/v1/job",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({file:a.files[a.file]})})}},o?r.a.createElement("span",null,r.a.createElement(le.a,{icon:oe.b})," Play"):r.a.createElement("span",null,r.a.createElement(le.a,{icon:oe.a})," Pause")),r.a.createElement(p.a,{color:"secondary",variant:"contained",onClick:function(){fetch("http://makerhub.local:8080/api/v1/job",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({file:a.files[a.file]})})}},r.a.createElement("span",null,r.a.createElement(le.a,{icon:oe.c})," Stop"))),r.a.createElement("div",{className:"print-status-bar"},r.a.createElement(ce.a,{variant:"determinate",value:f}))))},ue=(Object(E.a)({buttonContainer:{display:"flex",justifyContent:"center",marginTop:"10px"}}),a(208)),me=a(186),de=a(187),pe=a(188),fe=a(189),Ee=a(190),he=a(191),be=a(90),ge=a.n(be),ve=Object(E.a)((function(e){return{drawerContainer:{width:"100%"},header:{display:"flex",alignItems:"center"},item:{height:"100px",padding:"0 22px"},printButton:{width:"120px",height:"40px",alignSelf:"center",marginTop:"auto",marginBottom:"100px"},summary:{height:"56px",cursor:"pointer","&$selected, &$selected:hover":{backgroundColor:e.palette.secondary.main}},selected:{},hover:{},text:{fontSize:"1.5em",fontWeight:"bold"}}})),ye=function(e){var t=e.drawerOpen,a=e.setDrawerOpen,c=e.fileLocation,l=ve(),o=Object(n.useState)(""),s=Object(i.a)(o,2),u=s[0],m=s[1],d=Object(n.useState)(!0),f=Object(i.a)(d,2),E=f[0],h=f[1],b=Object(n.useState)([]),g=Object(i.a)(b,2),v=g[0],y=g[1];Object(n.useEffect)((function(){if(t){var e=function(){var e=Object(N.a)(w.a.mark((function e(){var t;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=null,"local"!=c){e.next=7;break}return e.next=4,fetch("http://makerhub.local:8080/api/v1/files",{method:"GET"});case 4:t=e.sent,e.next=12;break;case 7:return e.next=9,fetch("http://makerhub.local:8080/api/v1/usb/refresh",{method:"POST"});case 9:return e.next=11,fetch("http://makerhub.local:8080/api/v1/usb/files",{method:"GET"});case 11:t=e.sent;case 12:return e.abrupt("return",t.json());case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();h(!0),e().then((function(e){console.log(e),y(e.files),h(!1)}))}}),[t]);return r.a.createElement(ue.a,{anchor:"right",open:t,onClose:function(){return a(!1)},classes:{paper:l.drawerContainer}},r.a.createElement("div",{className:l.header},r.a.createElement(T.a,{"aria-label":"back",onClick:function(){return a(!1)}},r.a.createElement(L.a,null)),r.a.createElement("h2",null,c.toUpperCase())),E?r.a.createElement(D.a,{className:l.backdrop,open:!0},r.a.createElement(F.a,{color:"inherit"})):r.a.createElement(me.a,null,r.a.createElement(de.a,null,r.a.createElement(pe.a,null,r.a.createElement(fe.a,null,r.a.createElement(Ee.a,null,"Name"),r.a.createElement(Ee.a,null,"Date"),r.a.createElement(Ee.a,null,"Size"))),r.a.createElement(he.a,null,v&&v.map((function(e){return r.a.createElement(fe.a,{key:e.display,onClick:function(){return m(e.display)},selected:u===e.display,className:l.summary,classes:{selected:l.selected,hover:l.hover}},r.a.createElement(Ee.a,null,e.display),r.a.createElement(Ee.a,null,ge()(e.date).format("MM/DD/YYYY LTS")),r.a.createElement(Ee.a,null,function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;if(0===e)return"0 Bytes";var a=1024,n=t<0?0:t,r=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],c=Math.floor(Math.log(e)/Math.log(a));return parseFloat((e/Math.pow(a,c)).toFixed(n))+" "+r[c]}(e.size)))}))))),r.a.createElement(p.a,{variant:"contained",disabled:u.length<=0,onClick:function(){return console.log(u),"local"==c?fetch("http://makerhub.local:8080/api/v1/job/".concat(u),{method:"POST",headers:{"Content-Type":"application/json"}}):fetch("http://makerhub.local:8080/api/v1/usb/copy/".concat(u),{method:"POST",headers:{"Content-Type":"application/json"}}).then((function(e){fetch("http://makerhub.local:8080/api/v1/job/".concat(u),{method:"POST",headers:{"Content-Type":"application/json"}})})),a((function(){return!1})),void m("")},className:l.printButton},"Print"))},Oe=(a(121),Object(E.a)({buttonContainer:{display:"flex",justifyContent:"center",marginTop:"10px"},textCenter:{textAlign:"center",marginTop:"10px"}})),je=function(e){var t=e.lastMessage,a=(e.setActiveMode,e.setDisabledNav),c=Oe(),l=Object(n.useState)({extruder:0,bed:0,connected:!1,feed:"1",file:-1,files:[],printing:!1,progress:0,paused:!1}),o=Object(i.a)(l,2),s=o[0],u=o[1],d=Object(n.useState)(!1),f=Object(i.a)(d,2),E=(f[0],f[1]),h=Object(n.useState)(null),b=Object(i.a)(h,2),g=(b[0],b[1],Object(n.useState)(null)),v=Object(i.a)(g,2),O=v[0],j=v[1],k=Object(n.useState)(null),C=Object(i.a)(k,2),S=C[0],x=C[1],M=Object(n.useState)(null),T=Object(i.a)(M,2),P=T[0],z=T[1],G=Object(n.useState)(!1),I=Object(i.a)(G,2),B=I[0],A=I[1],D=Object(n.useState)(""),F=Object(i.a)(D,2),Z=F[0],L=F[1],W=function(e){L(e),A(!0)};return r.a.useEffect((function(){if("undefined"!==typeof t&&t&&"undefined"!==typeof t.data&&t.data.length>1){var e=JSON.parse(t.data.substring(1));console.log(e),e[0].hasOwnProperty("current")&&e[0].current.state&&(console.log(e[0].current.state),j(e[0].current.state),console.log(O)),e[0].hasOwnProperty("current")&&e[0].current.job&&(console.log(e[0].current.job),x(e[0].current.job),console.log(S)),e[0].hasOwnProperty("current")&&e[0].current.progress&&(z(e[0].current.progress),console.log(P))}}),[t]),r.a.createElement(m.a,null,P&&S&&S.file.name&&P.completion<100?r.a.createElement(se,{lastMessage:t,progressState:P,setDisabledNav:a,state:s}):r.a.createElement(m.a,null,r.a.createElement(y,{title:"Local",onClick:function(){return W("local")}}),r.a.createElement(y,{title:"USB",onClick:function(){return W("usb")}}),r.a.createElement(ye,{setDrawerOpen:A,drawerOpen:B,fileLocation:Z}),r.a.createElement("div",{className:"Files"},r.a.createElement("label",{className:"Files-Upload"},r.a.createElement("span",null,"Upload"),r.a.createElement("input",{type:"file",onChange:function(){var e=Object(N.a)(w.a.mark((function e(t){var a;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=new FormData,console.log(t.target.files),t.persist(),a.append("file",t.target.files[0]),e.next=6,fetch("http://makerhub.local:8080/api/v1/files/".concat(t.target.files[0].name),{method:"POST",body:a});case 6:return e.next=8,fetch("http://makerhub.local:8080/api/v1/job/".concat(t.target.files[0].name),{method:"POST",headers:{"Content-Type":"application/json"}});case 8:s.printing=!0,E(!0),u({files:[].concat(Object(re.a)(s.files),[t.target.files[0].name]),file:0});case 11:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()})))),r.a.createElement("div",null,r.a.createElement(m.a,null,O&&S&&(S.file?r.a.createElement("div",null,r.a.createElement("div",{className:c.textCenter},O.text," ",S.file.display),r.a.createElement("div",{className:c.buttonContainer},P&&(null==P.completion||100==P.completion)&&S&&S.file.display&&r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){fetch("http://makerhub.local:8080/api/v1/job/".concat(S.file.name),{method:"POST",headers:{"Content-Type":"application/json"}})}},"Print"))):r.a.createElement("span",null,"Not Printing")))))},ke=a(203),Ce=a(95),Se=a(192),xe=a(193),we=a(194),Ne=a(195),Me=(a(122),Object(E.a)({btnContainer:{marginTop:"14px",marginBottom:"28px",textAlign:"center"},centerBtns:{"& button":{margin:"0 12px"}},tabs:{"& button":{textTransform:"none"}}})),Te=[.1,1,10],Pe=function(e){e.position;var t=Me(),a=Object(n.useState)(1),c=Object(i.a)(a,2),l=c[0],o=c[1],s=function(e){fetch("http://makerhub.local:8080/api/v1/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gcode:e})})},u=function(e){fetch("http://makerhub.local:8080/api/v1/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gcode:"G28 ".concat(e,"\nM114\n")})})},f=function(e,t){var a="".concat(e).concat(t?-Te[l]:Te[l]);fetch("http://makerhub.local:8080/api/v1/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gcode:"M220 S200\nG91\nG0 ".concat(a,"\nM220 S100\nM114\n")})})};return r.a.createElement(ke.a,{style:{textAlign:"center"}},r.a.createElement(d.a,{variant:"h4"},"Moving"),r.a.createElement(m.a,{container:!0,justify:"flex-start",spacing:6,style:{margin:0}},r.a.createElement(m.a,{item:!0,xs:6,style:{display:"flex",justifyContent:"space-between"}},r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){s("G28\nM114\n")}},"Home All ",r.a.createElement(Se.a,null)),r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){s("G29 T\nM114\n")}},"Level Bed"))),r.a.createElement(m.a,{container:!0,justify:"center",className:t.btnContainer,spacing:3},r.a.createElement(m.a,{item:!0},r.a.createElement(Ce.a,null,r.a.createElement(te.a,{value:l,className:t.tabs,onChange:function(e,t){return o(t)}},Te.map((function(e){return r.a.createElement(ae.a,{label:"".concat(e,"mm"),key:e})}))))),r.a.createElement(m.a,{item:!0,container:!0,xs:10},r.a.createElement(m.a,{container:!0,item:!0,xs:6,justify:"center",alignItems:"flex-start",spacing:1},r.a.createElement(m.a,{item:!0,xs:12,style:{alignSelf:"flex-start"}},r.a.createElement(d.a,{variant:"body1"},"X")),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return f("X",!0)}},r.a.createElement(xe.a,null))),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return u("X")}},r.a.createElement(Se.a,null))),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return f("X",!1)}},r.a.createElement(S.a,null)))),r.a.createElement(m.a,{container:!0,item:!0,xs:!0,direction:"column",alignItems:"center",spacing:1},r.a.createElement(m.a,{item:!0,xs:12},r.a.createElement(d.a,{variant:"body1"},"Y")),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return f("Y",!1)}},r.a.createElement(we.a,null))),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return u("Y")}},r.a.createElement(Se.a,null))),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return f("Y",!0)}},r.a.createElement(Ne.a,null)))),r.a.createElement(m.a,{container:!0,item:!0,xs:!0,direction:"column",alignItems:"center",spacing:1},r.a.createElement(m.a,{item:!0,xs:12},r.a.createElement(d.a,{variant:"body1"},"Z")),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return f("Z",!1)}},r.a.createElement(we.a,null))),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return u("Z")}},r.a.createElement(Se.a,null))),r.a.createElement(m.a,{item:!0},r.a.createElement(p.a,{color:"secondary",size:"large",variant:"contained",onClick:function(){return f("Z",!0)}},r.a.createElement(Ne.a,null)))))))},ze=a(45),Ge=a.n(ze);a(123);function Ie(e){return r.a.createElement("div",{className:"Thermometer"},e.label,r.a.createElement("div",{className:"Thermometer-Container"},r.a.createElement("div",{className:"Thermometer-Bulb-Container"}),r.a.createElement("div",{className:"Thermometer-Indicator-Container"},r.a.createElement("div",{className:"Thermometer-Indicator",style:{height:"".concat(25+(e.value-e.min)/(e.max-e.min)*100,"%")}}),r.a.createElement("div",{className:"Thermometer-Bulb"},r.a.createElement("span",null,e.value)))))}a(124);var Be=function(e){var t=e.bed,a=e.extruder,n=function(e){fetch("http://makerhub.local:8080/api/v1/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gcode:e})})};return r.a.createElement(z.a,null,r.a.createElement(G.a,{classes:{content:"accordion-style"}},r.a.createElement("h3",{style:{margin:0}},"Heating"),r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){n("M104 S0\nM140 S0\n")}},"Cooldown All"),r.a.createElement(Ge.a,null)),r.a.createElement(B.a,null,r.a.createElement("div",{className:"control-heating-container"},r.a.createElement("h4",null,"Nozzle"),r.a.createElement("div",null,r.a.createElement(p.a,{variant:"outlined",onClick:function(){n("M104 S220\n")}},"Preheat PLA"),r.a.createElement(p.a,{variant:"outlined",onClick:function(){n("M104 S0\n")}},"Cooldown")),r.a.createElement("h4",null,"Bed"),r.a.createElement("div",{style:{display:"flex"}},r.a.createElement(p.a,{variant:"outlined",onClick:function(){n("M140 S50\n")}},"Preheat PLA"),r.a.createElement(p.a,{variant:"outlined",onClick:function(){n("M140 S0\n")}},"Cooldown"))),r.a.createElement("div",{className:"monitor-heating-container"},r.a.createElement("div",{className:"Guages"},r.a.createElement("div",null,r.a.createElement(Ie,{label:"Nozzle",value:a,min:0,max:400})),r.a.createElement("div",null,r.a.createElement(Ie,{label:"Bed",value:t,min:0,max:150}))))))},Ae=(a(125),function(e){var t=r.a.useState(0),a=Object(i.a)(t,2),n=a[0],c=a[1],l=r.a.useState(0),o=Object(i.a)(l,2),s=o[0],u=o[1],m=r.a.useState({x:0,y:0,z:0}),d=Object(i.a)(m,2),p=d[0],f=d[1];return r.a.useEffect((function(){if("undefined"!==typeof e&&"undefined"!==typeof e.lastMessage&&e.lastMessage&&"undefined"!==typeof e.lastMessage.data&&e.lastMessage.data.length>1){var t=JSON.parse(e.lastMessage.data.substring(1));if(console.log(t),t[0].hasOwnProperty("current")&&t[0].current.temps[0]&&t[0].current.temps[0]){var a=t[0].current.temps[0];u(parseInt(a.tool0.actual)),c(parseInt(a.bed.actual))}t[0].hasOwnProperty("event")&&t[0].event.hasOwnProperty("payload")&&t[0].event.payload&&f({x:t[0].event.payload.x,y:t[0].event.payload.y,z:t[0].event.payload.z})}}),[e]),r.a.createElement(r.a.Fragment,null,r.a.createElement(Pe,{position:p}),r.a.createElement(Be,{extruder:s,bed:n}))}),De=a(196),Fe=a(197),Ze=function(){return r.a.createElement(z.a,null,r.a.createElement(G.a,{classes:{content:"accordion-style"}},r.a.createElement("h3",{style:{margin:"0"}},"About"),r.a.createElement(Ge.a,null)),r.a.createElement(B.a,null,r.a.createElement("div",null,r.a.createElement("h3",null,"List Hardware Stats"),r.a.createElement("h3",null,"Firmware Version"))))},Le=function(){return r.a.createElement("div",null,r.a.createElement(m.a,{xs:3},"Network"),r.a.createElement(m.a,{xs:3},"Printer Type"),r.a.createElement(m.a,{xs:3}," User Type"))},We=Object(E.a)({componentContainer:{display:"flex",flex:1},drawerContainer:{width:"100%"},header:{display:"flex",alignItems:"center"},item:{height:"100px",padding:"0 22px"},text:{fontSize:"1.5em",fontWeight:"bold"}}),Je=[{name:"Tutorials",component:null},{name:"Settings",component:r.a.createElement(Le,null)},{name:"Manage Storage",component:null},{name:"Update",component:r.a.createElement(V,null)},{name:"Reset",component:null},{name:"About",component:r.a.createElement(Ze,null)}],Ue=function(e){e.setActiveMode;var t=We(),a=Object(n.useState)(!1),c=Object(i.a)(a,2),l=c[0],o=c[1],s=Object(n.useState)({}),m=Object(i.a)(s,2),p=m[0],f=m[1];return r.a.createElement("div",null,r.a.createElement(P.a,null,Je.map((function(e){return r.a.createElement(r.a.Fragment,{key:"".concat(e.name,"-item")},r.a.createElement(I.a,{button:!0,onClick:function(){return function(e){f(e),o(!0)}(e)},className:t.item},r.a.createElement(De.a,{primary:r.a.createElement(d.a,{className:t.text},e.name)}),r.a.createElement(Ge.a,null)),r.a.createElement(Fe.a,null))}))),r.a.createElement(ue.a,{anchor:"right",open:l,onClose:function(){return o(!1)},classes:{paper:t.drawerContainer}},r.a.createElement("div",{className:t.header},r.a.createElement(T.a,{"aria-label":"back",onClick:function(){return o(!1)}},r.a.createElement(L.a,null)),r.a.createElement("h2",null,p.name)),r.a.createElement(u.a,{className:t.componentContainer},p.component)))},Ye=a(198),Re=function(){var e=Object(n.useState)(0),t=Object(i.a)(e,2),a=t[0],c=t[1],l=function(e){fetch("http://makerhub.local:8080/api/v1/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gcode:e})})};return r.a.createElement("div",null,r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){l("M851 Z0.00\nM500\nM501\nG28\nG90\nM211 S0\nG1 Z0\n")}},"Start Z Offset ",r.a.createElement(le.a,null)),r.a.createElement("hr",null),r.a.createElement(Ye.a,{"aria-label":"outlined primary button group"},r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z-1\nM114\n"),c(a-1),console.log(a)}},"-1"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z-0.5\nM114\n"),c(a-.5),console.log(a)}},"-0.5"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z-0.1\nM114\n"),c(a-.1),console.log(a)}},"-0.1"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z-0.01\nM114\n"),c(a-.01),console.log(a)}},"-0.01"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G90\nG1 Z0\n"),c(0),console.log(a)}},"0"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z0.01\nM114\n"),c(a+.01),console.log(a)}},"+0.01"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z0.1\nM114\n"),c(a+.1),console.log(a)}},"+0.1"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z0.5\nM114\n"),c(a+.5),console.log(a)}},"+0.5"),r.a.createElement(p.a,{size:"large",onClick:function(){l("G91\nG0 Z1\nM114\n"),c(a+1),console.log(a)}},"+1")),r.a.createElement("hr",null),r.a.createElement(p.a,{color:"primary",variant:"contained",onClick:function(){l("G90\nM851 Z"+a+"\nM211 S1\nM500\nM501\nG28\n"),console.log(a)}},"Complete Z Offset ",r.a.createElement(le.a,null)))},He=(a(126),Object(E.a)((function(e){return{appBar:{top:"auto",bottom:0}}}))),Xe=["Print","Control","Tune","Menu"],$e=function(e){var t=e.lastMessage,a=(e.mode,e.setActiveMode),c=He(),l=Object(n.useState)("Print"),o=Object(i.a)(l,2),s=o[0],u=o[1],m=Object(n.useState)(!1),d=Object(i.a)(m,2),p=d[0],f=d[1],E={Print:r.a.createElement(je,{lastMessage:t,setActiveMode:a,setDisabledNav:f}),Control:r.a.createElement(Ae,{lastMessage:t}),Menu:r.a.createElement(Ue,{setActiveMode:a}),Tune:r.a.createElement(Re,null)};return r.a.createElement("div",{className:"home-container"},r.a.createElement(ee.a,{position:"fixed",color:"primary",className:c.appBar,disabled:!0},r.a.createElement(ne,{tabList:Xe,handleTabClick:function(e,t){u(Xe[t])},activeTab:Xe.indexOf(s),disabledNav:p})),r.a.createElement("div",{className:"component-container"},E[s]))},qe=a(91),Ke=a(200),Ve=a(40),Qe=a.n(Ve),_e=Object(qe.a)({palette:{primary:{main:"rgb(42, 57, 131)"},secondary:{main:"#CD6930"},type:"dark"}}),et=function(){var e,t=Object(n.useState)(null),a=Object(i.a)(t,2),c=a[0],l=a[1],u=Object(n.useState)(!1),m=Object(i.a)(u,2),d=m[0],p=m[1],f=Object(n.useState)(!0),E=Object(i.a)(f,2),h=E[0],b=E[1];M((function(){var e=j("onboarded"),t=j("userMode");p(e),l(t),b(!1)}));var g=Object(n.useState)("ws://makerhub.local:9000/sockjs/718/qerksnvm/websocket"),v=Object(i.a)(g,2),y=v[0],O=(v[1],Object(n.useRef)([])),k=Qe()(y,{shouldReconnect:function(e){return!0},reconnectAttempts:999999,reconnectInterval:0,onOpen:function(){console.log("socket opened")},onError:function(){console.log("socket error")},onClose:function(){console.log("socket closed")}}),C=k.sendMessage,S=k.lastMessage,x=k.readyState;O.current=Object(n.useMemo)((function(){return O.current.concat(S)}),[S]);var w=(e={},Object(o.a)(e,Ve.ReadyState.CONNECTING,"Connecting"),Object(o.a)(e,Ve.ReadyState.OPEN,"Open"),Object(o.a)(e,Ve.ReadyState.CLOSING,"Closing"),Object(o.a)(e,Ve.ReadyState.CLOSED,"Closed"),Object(o.a)(e,Ve.ReadyState.UNINSTANTIATED,"Uninstantiated"),e)[x];return r.a.useEffect((function(){console.log(w),"Open"==w&&(C('{ "auth": "E7BFE47F2DBF489B9E78A3D9D042874A" }'),C('{ "current": "state" }'))}),[w]),r.a.createElement(Ke.a,{theme:_e},r.a.createElement(s.a,null),r.a.createElement(ke.a,{height:"100vh",display:"flex",flexDirection:"column"},h?r.a.createElement(F.a,{style:{alignSelf:"center",marginTop:"auto",marginBottom:"auto"}}):d?r.a.createElement($e,{mode:c,lastMessage:S,setActiveMode:l}):r.a.createElement(_,{handleOnboarding:function(e){l(e),p(!0)}})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(et,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[103,1,2]]]);
//# sourceMappingURL=main.271a86f1.chunk.js.map