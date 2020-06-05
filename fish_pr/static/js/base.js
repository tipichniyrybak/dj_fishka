function closeForm(form) {
    switch (form) {
        case 'profile_update':
            $('#formProfileEditID').bPopup().close();
            break;
        case 'place_add':
            $('#formPlaceAddID').bPopup().close();
            break;
        case 'order_add':
            $('#formOrderAddID').bPopup().close();
            break;
        case 'send_message':
            $('#formSendMessageID').bPopup().close();
            break;
        default:

    }
}
