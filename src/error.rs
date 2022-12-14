use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum MyFlashloanProgramError {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
	/// Invalid instruction
    #[error("Instruction unpack error")]
    InstructionUnpackError,
    /// Not Rent Exempt
    #[error("Not Rent Exempt")]
    NotRentExempt,
    /// Incorrect program Id
    #[error("The account is not currently owned by the program")]
    IncorrectProgramId,
}

impl From<MyFlashloanProgramError> for ProgramError {
    fn from(e: MyFlashloanProgramError) -> Self {
        ProgramError::Custom(e as u32)
    }
}