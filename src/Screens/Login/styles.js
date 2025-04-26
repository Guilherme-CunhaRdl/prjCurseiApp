import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
      logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
      },
      logo: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
      },
      logoShape: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
        transform: [{ rotate: '45deg' }],
        borderRadius: 5,
      },
      welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#000',
      },
      formContainer: {
        paddingHorizontal: 24,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#f8f8f8',
      },
      inputIcon: {
        marginRight: 10,
        fontSize: 20,
        color: 'gray',
      },
      input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
      },
      visibilityIcon: {
        padding: 5,
      },
      loginButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
      },
      loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      forgotPasswordButton: {
        alignItems: 'center',
        marginTop: 20,
      },
      forgotPasswordText: {
        color: '#2196F3',
        fontSize: 14,
      },
      dividerContainer: {
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
      },
      divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e1e1e1',
      },
      dividerText: {
        marginHorizontal: 10,
        color: '#999',
        fontSize: 14,
      },
      socialButtonsContainer: {
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
      },
      socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
      },
      socialIconG: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#e83427',
      },
      socialIconF: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#2368de',
      },
      signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
      },
      signupText: {
        color: '#666',
        fontSize: 14,
      },
      signupLink: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: 'bold',
      },
})