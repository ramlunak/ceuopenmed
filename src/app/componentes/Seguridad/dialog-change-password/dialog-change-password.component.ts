import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SegUsuario } from 'src/app/models/Seguridad/seg-usuario';
import { SegUsuarioService } from 'src/app/services/seguridad/seg-usuario.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.css']
})
export class DialogChangePasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: SegUsuario,
    private usuarioService: SegUsuarioService,
    private errorService: ErrorHandlerService,
  ) {
    this.usuarioService.formChangePass.patchValue({ id: usuario.id, uusername: usuario.username });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCambiarClick() {
    this.usuarioService.changePassword().subscribe(result => {

      if (result.status === 1) {
        this.dialogRef.close({OK: 'Su contraseña ha sido cambiada satisfactoriamente.'});
      } else {
        this.errorService.handleError(result.error);
      }
      this.LimpiarPass();
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  LimpiarPass() {
    this.usuarioService.formChangePass.reset();
    this.usuarioService.InicializarValoresFormChangePassGroup();
  }

}
