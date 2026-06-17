package com.conectarsj.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class TelefonoContacto {

    @Column(nullable = false, length = 100)
    private String numero;

    @Column(name = "es_whatsapp")
    private boolean esWhatsapp = false;

    public TelefonoContacto() {}

    public TelefonoContacto(String numero, boolean esWhatsapp) {
        this.numero = numero;
        this.esWhatsapp = esWhatsapp;
    }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public boolean isEsWhatsapp() { return esWhatsapp; }
    public void setEsWhatsapp(boolean esWhatsapp) { this.esWhatsapp = esWhatsapp; }
}
