

    import { StyleSheet } from 'react-native';

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      capa: {
        flex: 0.6,
        height: 120,
        backgroundColor: '#4B97FF',
        justifyContent: 'center',
        alignItems: 'center',
      },
      bannerText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginTop: 8,
      },
      userContainer: {
        alignItems: 'center',
        marginTop: -40,
      },
      userPhotoCircle: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      user: {
        flex: 0.4,
        width: 120,           
        height: 120,          
        paddingLeft: 10,
        borderRadius: 70,
        borderWidth: 4,
        borderColor:'white',
        bottom: 55,
        left: '13%',
        transform: [{ translateX: -40 }], 
      },
      cadastro: {
        flex: 2, 
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        bottom:55,
      },
      subtitulo: {
        bottom:55,
        fontSize: 14,
        color: '#7E7E7E',
        marginBottom: 20,
      },
      grid: {
        bottom:35,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      interesseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#F5F8FF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8F0',
      },
      interesseSelecionado: {
        backgroundColor: '#4B97FF',
        borderColor: '#4B97FF',
      },
      iconContainer: {
        marginRight: 8,
      },
      interesseText: {
        fontSize: 14,
        color: '#333333',
      },
      textoSelecionado: {
        color: '#FFFFFF',
      },
      btFinalizar: {
        backgroundColor: '#4B97FF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
      },
      btVoltar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
      },
      buttomText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      },
      voltarText: {
        color: '#4B97FF',
        fontSize: 16,
        marginLeft: 8,
        fontWeight:'bold',

      },
      input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 10,
      },
    });
    
    export default styles;