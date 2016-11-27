(function() {
	'use strict';

	var data = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

	var routes = [
	// 	 S  A    B      C      D      E      F      G
		[0, 0.1, 0.233, 0.167, 0,     0,     0,     0   ], //S
		[0, 0,   0.1,   0,     0.4,   0,     0,     0   ], //A
		[0, 0.1, 0,     0.067, 0,     0.25,  0,     0   ], //B
		[0, 0,   0.067, 0,     0,     0,     0.3,   0   ], //C
		[0, 0,   0,     0,     0,     0.067, 0,     0.15], //D
		[0, 0,   0,     0,     0.067, 0,     0.067, 0.15], //E
		[0, 0,   0,     0,     0,     0.067, 0,     0.15], //F
		[0, 0,   0,     0,     0,     0,     0,     0   ], //G
	];

	// inisialisasi populasi sejumlah n
	function initPopulation(n) {
		let population = [];
		for (var i = 0; i < n; i++) {
			let chromosome = [];
			chromosome.push(0);
			let preindex = 0;
			let index = Math.floor(Math.random() * 7 + 1);
			while(chromosome.length < 8){
				if (chromosome.indexOf(7) != -1) {
					while(chromosome.indexOf(index) != -1){
						index = Math.floor(Math.random() * 7 + 1);
					}
				}else{
					while(((chromosome.indexOf(index) != -1) || routes[preindex][index] == 0)){
						index = Math.floor(Math.random() * 7 + 1);
					}
				}
				chromosome.push(index);
				preindex = index;
			}
			population.push(chromosome);
		}
		return population;
	}
	// console.log(initPopulation(4));

	// menghitung nilai fitness dari chromosome
	function fitness(chromosome) {
		// console.log(chromosome);
		let index = 0;
		let fitness = 0;
		while(chromosome[index] != 7){
			if (routes[chromosome[index]][chromosome[index+1]] == 0) {
				return 0;
			}
			fitness = fitness + routes[chromosome[index]][chromosome[index+1]];
			index++;
		}
		return 1 / fitness;
	}
	// console.log(fitness([0, 2, 5, 7, 6, 3]));

	// proses kawin silang kromosom
	function crossOver(arrayTmp) {
		let keep = [];
		let index = Math.floor(Math.random() * 8);
		keep.push(index);
		while(keep.indexOf(index) != -1){
			index = Math.floor(Math.random() * 8);
		}
		keep.push(index);
		let tmpA = [];
		let tmpB = [];
		for (var i = 0; i < 8 ; i++) {
			if (keep.indexOf(i) == -1) {
				tmpA.push(arrayTmp[1][i]);
				tmpB.push(arrayTmp[0][i]);
			}else{
				tmpA.push(arrayTmp[0][i]);
				tmpB.push(arrayTmp[1][i]);
			}
		}
		return [tmpA, tmpB];
	}
	// console.log(crossOver([0, 1, 2, 3, 4, 5, 6, 7], [7, 6, 5, 4, 3, 2, 1, 0]));

	// mengembalikan array yang berisi 4 kromosom dengan fitness tertinggi
	function maxFitness(n, population) {
		let arrFitness = population.sort(function(a, b) {
			if (fitness(a) > fitness(b)) {
				return -1;
			}

			if (fitness(a) < fitness(b)) {
				return 1;
			}

			return 0;
		});
		return arrFitness.slice(0, n);
	}

	// memilih 2 kromosom secara acak
	function roulette(population) {
		let arrFitness = [];
		let sum = 0;
		for (var i = 0; i < population.length; i++) {
			let fitnessValue = fitness(population[i]);
			arrFitness.push(fitnessValue);
			sum = sum + fitnessValue;
		}
		let chosenArr = [];
		let random = Math.random();
		for (var j = 0; j < 2; j++) {
			let find = false;
			let before = arrFitness[0];
			i = 0;
			while(!find){
				// console.log('hm');
				if (random < before/sum) {
					if (chosenArr.indexOf(population[i]) == -1) {
						chosenArr.push(population[i]);
						find = true;
					}else{
						random = Math.random();
						i = 0;
						before = arrFitness[0];
					}
				}
				i++;
				before = before + arrFitness[i];
			}
		}
		return chosenArr;
	}
	// console.log(roulette(initPopulation(4)));

	// menjalankan algoritma ga dan mengembalikan array of array routes
	function ga(n, count) {
		let population = initPopulation(n);
		// console.log(population, 'init');
		for (var i = 0; i < count; i++) {
			let populationTemp = [];
			for (var k = 0; k < n; k++) {
				populationTemp.push(population[k]);
			}
			for (var j = 0; j < 2; j++) {
				let tmp = crossOver(roulette(population));
				for (var k = 0; k < 2; k++) {
					populationTemp.push(tmp[k]);
				}
			}
			population = maxFitness(n, populationTemp);
			// for (var k = 0; k < 4; k++) {
			// 	console.log(population[k], fitness(population[k]));
			// }
		}
		return population;
	}

	function main(n, count) {
		var result = ga(n, count);
		// for (var i = 0; i < n; i++) {
			let rute = [];
			let k = 0;
			let end = false;
			let time = 0;
			let arrFitness = result.sort(function(a, b) {
				if (fitness(a) > fitness(b)) {
					return -1;
				}

				if (fitness(a) < fitness(b)) {
					return 1;
				}

				return 0;
			});
			while(k < 8 && !end){
				rute.push(data[arrFitness[0][k]]);
				time = time + routes[arrFitness[0][k]][arrFitness[0][k+1]];
				if (arrFitness[0][k] == 7) {
					end = true;
				}
				k++;
			}
			console.log(rute, "fitness : " + fitness(arrFitness[0]), "waktu : " + time + " jam");
		// }
	}

	main(15, 10);
})();