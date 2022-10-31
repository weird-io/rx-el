export const DEVICE_DETAILS_TEMPLATE =
  '<h2>Dashboard</h2>' +
  '<dl class=”definition-list”> ' +
  '    {{? data && data.model}}' +
  '        {{~data.model :parameter}}' +
  '            <dt>{{=parameter.prop1}}</dt>' +
  '            <dd>{{=parameter.prop2}}</dd>' +
  '            <dd>{{=parameter.prop3}}</dd>' +
  '            <dd>{{=parameter.prop4}}</dd>' +
  '            <dd>{{=parameter.prop5}}</dd>' +
  '            <dd>{{=parameter.prop6}}</dd>' +
  '            <dd>{{=parameter.prop7}}</dd>' +
  '            <dd>{{=parameter.prop8}}</dd>' +
  '        {{~}}' +
  '    {{?}}' +
  '</dl>';

export const DEVICE_REGISTER_TEMPLATE =
  '<table class="device-register">' +
  '    <thead class="tablet-only">' +
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
  prop1: 'prop1',
  prop2: 'prop2',
  prop3: 'prop3',
  prop4: 'prop4',
  prop5: 5,
  prop6: 6,
  prop7: 7,
  prop8: 8,
};
