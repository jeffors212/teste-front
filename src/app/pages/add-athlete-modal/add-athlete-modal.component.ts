import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



@Component({
  selector: 'app-add-athlete-modal',
  templateUrl: './add-athlete-modal.component.html',
  styleUrls: ['./add-athlete-modal.component.scss']
})
export class AddAthleteModalComponent implements OnInit {
  name = '';
  email:'';
  cpf = '';
  age = '';
  gender='';
  country='';
  category='';
  specialty= '';

  constructor() { }

  ngOnInit() {

  }

   validadeCpf(cpf) {
    // Verifica se o CPF contém apenas números
    if (!/^\d*$/.test(cpf)) {
        alert("Por favor, insira apenas números no campo CPF.");
        return;
    }

}

onSubmit(): void {
  // Verifica se todos os campos foram preenchidos
  if (this.name.trim() && this.email.trim() && this.cpf.trim()) {
    // Todos os campos estão preenchidos, continue com a lógica de submissão
    console.log("Formulário enviado:", this.name, this.email, this.cpf,this.age,this.gender,this.country,this.category,this.specialty);
  } else {
    console.error("Por favor, preencha todos os campos do formulário.");
    alert("Todos os campos são obrigatórios.");
  }
}

}
