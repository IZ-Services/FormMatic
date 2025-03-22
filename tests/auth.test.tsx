// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { emailSignIn } from '../src/context/AuthContext'; // Adjust path
// import { auth } from '../firebase-config';

// jest.mock('firebase/auth', () => ({
//   signInWithEmailAndPassword: jest.fn(),
// }));

// describe('Auth Functions', () => {
//   test('emailSignIn should call Firebase signInWithEmailAndPassword', async () => {
//     (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
//       user: { uid: '12345' },
//     });

//     await emailSignIn('test@example.com', 'password123');

//     expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
//       auth,
//       'test@example.com',
//       'password123'
//     );
//   });
// });
