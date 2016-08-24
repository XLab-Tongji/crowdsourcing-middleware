var project_role_enum = [
{'code':40,'role':'master'},
{'code':30,'role':'developer'},
];

var getRoleByCode = function(code){
	for(var i=0;i<project_role_enum.length;i++){
		if(code == project_role_enum[i].code) return project_role_enum[i].role;
	}
}

project_role_config = {
	getRoleByCode:getRoleByCode,
	project_role_enum:project_role_enum
}
module.exports = project_role_config; 



