export const DEVICE_DETAILS_TEMPLATE =
    '<h2>Dashboard</h2>' +
    '<dl class="definition-list"> ' +
    '    {{? data && data.model}}' +
    '        {{~data.model :parameter}}' +
    '            <dt>{{=parameter.prop1}}</dt>' +
    '            <dd>{{=parameter.prop2}}</dd>' +
    '            <dt>{{=parameter.prop3}}</dt>' +
    '            <dd>{{=parameter.prop4}}</dd>' +
    '            <dt>{{=parameter.prop5}}</dt>' +
    '            <dd>{{=parameter.prop6}}</dd>' +
    '            <dt>{{=parameter.prop7}}</dt>' +
    '            <dd>{{=parameter.prop8}}</dd>' +
    '        {{~}}' +
    '    {{?}}' +
    '</dl>';

export const DEVICE_REGISTER_TEMPLATE =
    '<table class="device-register">' +
    '    <thead>' +
    '         <tr>' +
    '             <th>Prop1</th>' +
    '             <th>Prop2</th>' +
    '             <th>Prop3</th>' +
    '             <th>Prop4</th>' +
    '             <th>Prop5</th>' +
    '             <th>Prop6</th>' +
    '             <th>Prop7</th>' +
    '             <th>Prop8</th>' +
    '         </tr>' +
    '     </thead>' +
    '     <tbody>' +
    '         {{? data && data.model}}' +
    '             {{~data.model : parameter}}' +
    '                 <tr>' +
    '                     <td>{{=parameter.prop1}}</td>' +
    '                     <td>{{=parameter.prop2}}</td>' +
    '                     <td>{{=parameter.prop3}}</td>' +
    '                     <td>{{=parameter.prop4}}</td>' +
    '                     <td>{{=parameter.prop5}}</td>' +
    '                     <td>{{=parameter.prop6}}</td>' +
    '                     <td>{{=parameter.prop7}}</td>' +
    '                     <td>{{=parameter.prop8 }}</td>' +
    '                 </tr>' +
    '             {{~}}' +
    '         {{?}}' +
    '     </tbody>' +
    '</table>';

export const mockModel = {
    prop1: 1,
    prop2: 2,
    prop3: 3,
    prop4: 4,
    prop5: 5,
    prop6: 6,
    prop7: 7,
    prop8: 8,
};
